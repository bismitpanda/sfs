use std::{
    collections::HashMap,
    fs::File as StdFile,
    io::{Read, Seek, SeekFrom, Write},
    path::{Component, Path, PathBuf},
};

use aes_gcm::{
    aead::{rand_core::RngCore, Aead, OsRng},
    AeadCore, Aes256Gcm, Key, KeyInit,
};
use argon2::Argon2;
use itertools::Itertools;
use rkyv::{Archive, Deserialize, Serialize};
use snap::raw::{Decoder, Encoder};
use xxhash_rust::xxh3::xxh3_64;

use crate::{
    config::Config,
    datetime::{self, FileTimes},
};

#[derive(Archive, Serialize, Deserialize, Clone)]
#[archive(check_bytes)]
pub struct FileRecord {
    name: String,
    checksum: u64,
    offset: usize,
    len: usize,
    size: usize,
    nonce: [u8; 12],
    date_time: FileTimes,
}

#[derive(Archive, Serialize, Deserialize, Clone)]
#[archive(check_bytes)]
pub struct DirectoryRecord {
    name: String,
    date_time: FileTimes,
    entries: HashMap<String, usize>,
}

#[derive(Archive, Serialize, Deserialize, Clone)]
#[archive(check_bytes)]
pub enum Record {
    Empty,
    File(FileRecord),
    Directory(DirectoryRecord),
}

impl Record {
    fn as_file(&self) -> &FileRecord {
        let Self::File(file) = self else {
            unreachable!()
        };

        file
    }

    fn as_directory(&self) -> &DirectoryRecord {
        let Self::Directory(directory) = self else {
            unreachable!()
        };

        directory
    }

    fn as_directory_mut(&mut self) -> &mut DirectoryRecord {
        let Self::Directory(directory) = self else {
            unreachable!()
        };

        directory
    }
}

pub struct RecordTable {
    config: Config,
    cipher: Aes256Gcm,
    compressor: Encoder,
    decompressor: Decoder,
    backend: StdFile,

    curr_dir: PathBuf,

    meta: Meta,
    crypt: Crypt,
}

#[derive(Archive, Serialize, Deserialize)]
#[archive(check_bytes)]
struct Crypt {
    user_salt: [u8; 16],
    store_key: Vec<u8>,
    store_nonce: [u8; 12],
}

#[derive(Archive, Serialize, Deserialize)]
#[archive(check_bytes)]
pub struct Meta {
    entries: Vec<Record>,
    free_fragments: Vec<(usize, Vec<usize>)>,
    empty_records: Vec<usize>,
    end_offset: usize,
    pinned_records: Vec<usize>,
}

impl RecordTable {
    pub fn new(user_key: &str) -> Self {
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
            curr_dir: PathBuf::from("/"),
            config,
            meta: Meta {
                entries: Vec::from([Record::Directory(DirectoryRecord {
                    name: String::new(),
                    date_time: datetime::now(),
                    entries: HashMap::default(),
                })]),
                free_fragments: Vec::new(),
                empty_records: Vec::new(),
                end_offset: 0,
                pinned_records: Vec::new(),
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

    pub fn open(user_key: &str) -> Self {
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
            curr_dir: PathBuf::from("/"),
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
                .map(|&id| self.get_size(&self.meta.entries[id]))
                .sum(),
        }
    }

    fn normalize<P: AsRef<Path>>(&self, path: P) -> PathBuf {
        let path = self.curr_dir.join(path);
        let mut components = path.components().peekable();
        let mut ret = if let Some(c @ Component::Prefix(..)) = components.peek().copied() {
            components.next();
            PathBuf::from(c.as_os_str())
        } else {
            PathBuf::new()
        };

        for component in components {
            match component {
                Component::RootDir => ret.push(component.as_os_str()),
                Component::ParentDir => {
                    ret.pop();
                }
                Component::Normal(c) => ret.push(c),
                _ => {}
            }
        }

        ret
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
}

impl RecordTable {
    pub fn create_record<P: AsRef<Path>>(&mut self, path: P, contents: Option<Vec<u8>>) {
        let mut parent_record_id = 0;

        let path = self.normalize(path);
        let segments = path.components().collect_vec();
        let (last, dirs) = segments.split_last().unwrap();

        for dir in dirs {
            if let Component::Normal(segment) = dir {
                let dir_record = self.meta.entries[parent_record_id].as_directory();

                parent_record_id = dir_record.entries[segment.to_str().unwrap()];
            }
        }

        let name = last.as_os_str().to_str().unwrap();

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
                name: name.to_string(),
                date_time: datetime::now(),
                entries: HashMap::new(),
            })
        };

        let record_id = if let Some(id) = self.meta.empty_records.pop() {
            self.meta.entries[id] = record;

            id
        } else {
            self.meta.entries.push(record);

            self.meta.entries.len() - 1
        };

        let dir_record = self
            .meta
            .entries
            .get_mut(parent_record_id)
            .unwrap()
            .as_directory_mut();

        dir_record.entries.insert(name.to_string(), record_id);
    }

    pub fn read_file_record<P: AsRef<Path>>(&mut self, path: P) -> Vec<u8> {
        let mut parent_record_id = 0;

        let path = self.normalize(path);
        let segments = path.components().collect_vec();
        let (last, dirs) = segments.split_last().unwrap();

        for dir in dirs {
            if let Component::Normal(segment) = dir {
                let dir_record = self.meta.entries[parent_record_id].as_directory();

                parent_record_id = dir_record.entries[segment.to_str().unwrap()];
            }
        }

        let name = last.as_os_str().to_str().unwrap();
        let parent_record = self.meta.entries[parent_record_id].as_directory();
        let record = self.meta.entries[parent_record.entries[name]].clone();

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

    pub fn read_directory_record<P: AsRef<Path>>(&self, path: P) -> Vec<Record> {
        let mut parent_record_id = 0;

        let path = self.normalize(path);
        let segments = path.components().collect_vec();
        let (last, dirs) = segments.split_last().unwrap();

        for dir in dirs {
            if let Component::Normal(segment) = dir {
                let dir_record = self.meta.entries[parent_record_id].as_directory();

                parent_record_id = dir_record.entries[segment.to_str().unwrap()];
            }
        }

        let name = last.as_os_str().to_str().unwrap();
        let parent_record = self.meta.entries[parent_record_id].as_directory();
        let record = self.meta.entries[parent_record.entries[name]].as_directory();

        record
            .entries
            .values()
            .map(|&id| self.meta.entries[id].clone())
            .collect_vec()
    }

    pub fn update_record<P: AsRef<Path>>(&mut self, path: P, contents: &[u8]) {
        let mut parent_record_id = 0;

        let path = self.normalize(path);
        let segments = path.components().collect_vec();
        let (last, dirs) = segments.split_last().unwrap();

        for dir in dirs {
            if let Component::Normal(segment) = dir {
                let dir_record = self.meta.entries[parent_record_id].as_directory();

                parent_record_id = dir_record.entries[segment.to_str().unwrap()];
            }
        }

        let name = last.as_os_str().to_str().unwrap();
        let parent_record = self.meta.entries[parent_record_id].as_directory();
        let record = self.meta.entries[parent_record.entries[name]].as_file();

        if record.len > contents.len() {
            todo!()
        }
    }

    pub fn delete_record<P: AsRef<Path>>(&mut self, path: P) {
        let mut parent_record_id = 0;

        let path = self.normalize(path);
        let segments = path.components().collect_vec();
        let (last, dirs) = segments.split_last().unwrap();

        for dir in dirs {
            if let Component::Normal(segment) = dir {
                let dir_record = self.meta.entries[parent_record_id].as_directory();

                parent_record_id = dir_record.entries[segment.to_str().unwrap()];
            }
        }

        let dir_record = self
            .meta
            .entries
            .get_mut(parent_record_id)
            .unwrap()
            .as_directory_mut();

        let record_id = dir_record
            .entries
            .remove(last.as_os_str().to_str().unwrap())
            .unwrap();

        let record = std::mem::replace(&mut self.meta.entries[record_id], Record::Empty);
        self.meta.empty_records.push(record_id);

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

impl Drop for RecordTable {
    fn drop(&mut self) {
        self.close();
    }
}
