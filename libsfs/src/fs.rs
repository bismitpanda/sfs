use std::{
    collections::{HashMap, HashSet},
    fs::File as StdFile,
    io::{Read, Seek, SeekFrom, Write},
    path::PathBuf,
};

use aes_gcm::{
    aead::{rand_core::RngCore, Aead, OsRng},
    AeadCore, Aes256Gcm, Key, KeyInit,
};
use argon2::Argon2;
use itertools::Itertools;
use snap::raw::{Decoder, Encoder};
use xxhash_rust::xxh3::xxh3_64;

use crate::{
    config::Config,
    datetime::{self, FileTimes},
};

#[derive(
    rkyv::Archive, rkyv::Serialize, rkyv::Deserialize, serde::Serialize, serde::Deserialize, Clone,
)]
#[archive(check_bytes)]
pub struct FileRecord {
    id: usize,
    name: String,
    #[serde(skip)]
    checksum: u64,
    #[serde(skip)]
    offset: usize,
    #[serde(skip)]
    len: usize,
    size: usize,
    #[serde(skip)]
    nonce: [u8; 12],
    date_time: FileTimes,
}

#[derive(
    rkyv::Archive, rkyv::Serialize, rkyv::Deserialize, serde::Serialize, serde::Deserialize, Clone,
)]
#[archive(check_bytes)]
pub struct DirectoryRecord {
    id: usize,
    name: String,
    date_time: FileTimes,
    entries: HashMap<String, usize>,
}

#[derive(
    rkyv::Archive, rkyv::Serialize, rkyv::Deserialize, serde::Serialize, serde::Deserialize, Clone,
)]
#[archive(check_bytes)]
pub struct SymlinkRecord {
    id: usize,
    name: String,
    date_time: FileTimes,
    reference_record_id: usize,
    is_file: bool,
}

#[derive(
    rkyv::Archive, rkyv::Serialize, rkyv::Deserialize, serde::Serialize, serde::Deserialize, Clone,
)]
#[serde(tag = "kind", content = "content")]
#[archive(check_bytes)]
pub enum Record {
    Empty,
    File(FileRecord),
    Directory(DirectoryRecord),
    Symlink(SymlinkRecord),
}

impl Record {
    fn as_file(&self) -> &FileRecord {
        let Self::File(file) = self else {
            unreachable!()
        };

        file
    }

    pub fn as_directory(&self) -> &DirectoryRecord {
        let Self::Directory(directory) = self else {
            unreachable!()
        };

        directory
    }

    pub fn name(&self) -> String {
        match self {
            Self::Directory(dir) => dir.name.clone(),
            Self::File(file) => file.name.clone(),
            Self::Symlink(symlink) => symlink.name.clone(),
            Self::Empty => String::new(),
        }
    }

    pub const fn id(&self) -> usize {
        match self {
            Self::Directory(dir) => dir.id,
            Self::File(file) => file.id,
            Self::Symlink(symlink) => symlink.id,
            Self::Empty => 0,
        }
    }
}

pub struct RecordTable {
    config: Config,
    cipher: Aes256Gcm,
    compressor: Encoder,
    decompressor: Decoder,
    backend: StdFile,

    curr_dir: DirectoryRecord,

    meta: Meta,
    crypt: Crypt,
}

#[derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)]
#[archive(check_bytes)]
struct Crypt {
    user_salt: [u8; 16],
    store_key: Vec<u8>,
    store_nonce: [u8; 12],
}

#[derive(
    rkyv::Archive, rkyv::Serialize, rkyv::Deserialize, serde::Serialize, serde::Deserialize,
)]
#[archive(check_bytes)]
pub struct Meta {
    entries: Vec<Record>,
    free_fragments: Vec<(usize, Vec<usize>)>,
    empty_records: Vec<usize>,
    end_offset: usize,
    pinned: HashSet<usize>,
}

impl RecordTable {
    pub fn init(user_key: &str) -> Self {
        if PathBuf::from("sfs.db").exists() {
            Self::open(user_key)
        } else {
            Self::new(user_key)
        }
    }

    fn new(user_key: &str) -> Self {
        let mut salt = [0; 16];
        OsRng.fill_bytes(&mut salt);

        let mut out = [0; 32];
        Argon2::default()
            .hash_password_into(user_key.as_bytes(), &salt, &mut out)
            .unwrap();

        let store_cipher = Aes256Gcm::new(Key::<Aes256Gcm>::from_slice(&out));
        let store_nonce = Aes256Gcm::generate_nonce(OsRng);
        let store_key = Aes256Gcm::generate_key(OsRng);
        let config = Config::new();
        let root_record = DirectoryRecord {
            id: 0,
            name: String::new(),
            date_time: datetime::now(),
            entries: HashMap::default(),
        };

        Self {
            cipher: Aes256Gcm::new(&store_key),
            compressor: Encoder::new(),
            decompressor: Decoder::new(),
            backend: StdFile::options()
                .create_new(true)
                .write(true)
                .read(true)
                .open(&config.storage)
                .unwrap(),
            curr_dir: root_record.clone(),
            config,
            meta: Meta {
                entries: Vec::from([Record::Directory(root_record)]),
                free_fragments: Vec::new(),
                empty_records: Vec::new(),
                end_offset: 0,
                pinned: HashSet::new(),
            },
            crypt: Crypt {
                store_key: store_cipher
                    .encrypt(&store_nonce, store_key.as_slice())
                    .unwrap(),
                store_nonce: store_nonce.into(),
                user_salt: salt,
            },
        }
    }

    fn open(user_key: &str) -> Self {
        let config = Config::new();

        let meta = rkyv::from_bytes::<Meta>(&std::fs::read(&config.meta).unwrap()).unwrap();
        let crypt = rkyv::from_bytes::<Crypt>(&std::fs::read(&config.crypt).unwrap()).unwrap();

        let mut out = [0; 32];
        Argon2::default()
            .hash_password_into(user_key.as_bytes(), &crypt.user_salt, &mut out)
            .unwrap();

        let store_cipher = Aes256Gcm::new(Key::<Aes256Gcm>::from_slice(&out));
        let store_key = store_cipher
            .decrypt(&crypt.store_nonce.into(), crypt.store_key.as_slice())
            .unwrap();

        Self {
            cipher: Aes256Gcm::new(store_key.as_slice().into()),
            compressor: Encoder::new(),
            decompressor: Decoder::new(),
            backend: StdFile::options()
                .write(true)
                .read(true)
                .open(&config.storage)
                .unwrap(),
            curr_dir: meta.entries[0].as_directory().clone(),
            config,
            meta,
            crypt,
        }
    }

    pub fn get_size(&self, record: &Record) -> usize {
        match record {
            Record::Empty => 0,
            Record::File(file) => file.size,
            Record::Directory(dir) => dir
                .entries
                .values()
                .map(|&record_id| self.get_size(&self.meta.entries[record_id]))
                .sum(),
            Record::Symlink(symlink) => {
                let record = &self.meta.entries[symlink.reference_record_id];

                if symlink.is_file {
                    record.as_file().size
                } else {
                    self.get_size(record)
                }
            }
        }
    }

    fn merge_free(&mut self) {
        let mut free_fragments = self
            .meta
            .free_fragments
            .iter()
            .flat_map(|(size, offsets)| offsets.iter().map(|offset| (*offset, *size)))
            .collect_vec();

        free_fragments.sort_unstable();

        let mut index = 0;
        let mut last_off = 0;
        let mut cur_size = 0;

        let mut new_free = Vec::new();

        while let Some(&(off, size)) = free_fragments.get(index) {
            if cur_size == 0 {
                last_off = off;
                cur_size = size;
            }

            if let Some(&(next_off, next_size)) = free_fragments.get(index + 1) {
                if off + size == next_off {
                    cur_size += next_size;
                } else {
                    new_free.push((last_off, cur_size));
                    cur_size = 0;
                }
            }

            index += 1;
        }

        new_free.push((last_off, cur_size));

        let mut fragments = HashMap::<_, Vec<_>>::new();

        for (off, size) in new_free {
            fragments
                .entry(size)
                .and_modify(|offs| offs.push(off))
                .or_insert_with(|| vec![off]);
        }

        self.meta.free_fragments = fragments.into_iter().collect_vec();
        self.meta.free_fragments.sort_unstable();
    }

    pub fn close(&self) {
        let meta = rkyv::to_bytes::<_, 1024>(&self.meta).unwrap();
        let crypt = rkyv::to_bytes::<_, 1024>(&self.crypt).unwrap();

        std::fs::write(&self.config.meta, &meta).unwrap();
        std::fs::write(&self.config.crypt, &crypt).unwrap();
    }

    pub fn pin(&mut self, record_id: usize) {
        self.meta.pinned.insert(record_id);
    }

    pub fn unpin(&mut self, record_id: usize) {
        self.meta.pinned.remove(&record_id);
    }
}

impl RecordTable {
    pub fn create_record(&mut self, name: &str, contents: Option<Vec<u8>>) -> Record {
        let record = if let Some(contents) = contents {
            let checksum = xxh3_64(&contents);
            let mut nonce = [0; 12];
            OsRng.fill_bytes(&mut nonce);

            let size = contents.len();

            let enc = self
                .cipher
                .encrypt(&nonce.into(), contents.as_slice())
                .unwrap();
            let compressed = self.compressor.compress_vec(&enc).unwrap();
            let len = compressed.len();

            let free_pos = self
                .meta
                .free_fragments
                .binary_search_by(|&(x, _)| x.cmp(&len))
                .unwrap_or_else(|pos| pos);

            let offset = if let Some((_, ids)) = self.meta.free_fragments.get_mut(free_pos) {
                ids.pop().unwrap()
            } else {
                let off = self.meta.end_offset;

                self.meta.end_offset += len;

                off
            };

            self.backend
                .seek(SeekFrom::Start(offset.try_into().unwrap()))
                .unwrap();
            self.backend.write_all(&compressed).unwrap();

            Record::File(FileRecord {
                id: 0,
                name: name.to_string(),
                checksum,
                nonce,
                size,
                len,
                offset,
                date_time: datetime::now(),
            })
        } else {
            Record::Directory(DirectoryRecord {
                id: 0,
                name: name.to_string(),
                date_time: datetime::now(),
                entries: HashMap::new(),
            })
        };

        let record_id = if let Some(id) = self.meta.empty_records.pop() {
            self.meta.entries[id] = record.clone();

            id
        } else {
            self.meta.entries.push(record.clone());

            self.meta.entries.len() - 1
        };

        self.curr_dir.entries.insert(name.to_string(), record_id);
        match self.meta.entries.get_mut(record_id).unwrap() {
            Record::Symlink(symlink) => symlink.id = record_id,
            Record::Directory(dir) => dir.id = record_id,
            Record::File(file) => file.id = record_id,
            Record::Empty => {}
        }

        record
    }

    pub fn read_file_record(&mut self, name: &str) -> Vec<u8> {
        let record = self.meta.entries[self.curr_dir.entries[name]].clone();

        let file_record = record.as_file();
        let mut buf = vec![0; file_record.len];
        self.backend
            .seek(SeekFrom::Start(file_record.offset as u64))
            .unwrap();
        self.backend.read_exact(&mut buf).unwrap();

        let decompressed = self.decompressor.decompress_vec(&buf).unwrap();
        let contents = self
            .cipher
            .decrypt(&file_record.nonce.into(), decompressed.as_slice())
            .unwrap();

        if xxh3_64(&contents) == file_record.checksum {
            return contents;
        }

        panic!("Corrupted data");
    }

    pub fn read_directory_record(&self, name: &str) -> Vec<Record> {
        let record = self.meta.entries[self.curr_dir.entries[name]].as_directory();

        record
            .entries
            .values()
            .map(|&id| self.meta.entries[id].clone())
            .collect_vec()
    }

    pub fn update_record(&mut self, name: &str, contents: &[u8]) {
        let record = self.meta.entries[self.curr_dir.entries[name]].as_file();

        if record.len > contents.len() {
            todo!()
        }
    }

    pub fn delete_record(&mut self, name: &str) {
        let record_id = self.curr_dir.entries.remove(name).unwrap();

        let record = std::mem::replace(&mut self.meta.entries[record_id], Record::Empty);
        self.meta.empty_records.push(record_id);

        self.meta.pinned.remove(&record_id);

        if let Record::File(file_record) = record {
            self.backend
                .seek(SeekFrom::Start(file_record.offset.try_into().unwrap()))
                .unwrap();
            self.backend.write_all(&vec![0; file_record.len]).unwrap();

            if let Some((_, free)) = self
                .meta
                .free_fragments
                .iter_mut()
                .find(|(size, _)| *size == file_record.len)
            {
                free.push(file_record.offset);
            } else {
                let free_pos = self
                    .meta
                    .free_fragments
                    .binary_search_by(|&(x, _)| x.cmp(&file_record.len))
                    .unwrap_or_else(|pos| pos);

                self.meta
                    .free_fragments
                    .insert(free_pos, (file_record.len, Vec::new()));
            }

            self.merge_free();
        }
    }
}
