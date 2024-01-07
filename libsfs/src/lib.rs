pub mod config;
pub mod error;
mod filetime;
mod fs;

pub use fs::*;

#[cfg(test)]
mod tests {
    use std::path::PathBuf;

    use crate::RecordTable;

    #[ignore]
    #[test]
    fn test_crud() {
        let mut sfs = RecordTable::init("user_key", &PathBuf::from(".")).unwrap();

        let dir1 = sfs.create("dir1", None).unwrap();
        let file1 = sfs
            .create("dir1/file1", Some("Hello, World!".as_bytes().to_vec()))
            .unwrap();

        let files = sfs.read_directory("dir1").unwrap();
        assert_eq!(sfs.get_size(&files[0]).unwrap(), 13);

        let file_data = String::from_utf8(sfs.read_file(file1.id).unwrap()).unwrap();
        assert_eq!(file_data, "Hello, World!");

        sfs.delete(file1.id).unwrap();
        sfs.delete(dir1.id).unwrap();

        sfs.close().unwrap();
    }
}
