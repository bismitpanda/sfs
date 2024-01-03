mod config;
mod datetime;
mod errors;
mod fs;

pub use fs::*;

#[cfg(test)]
mod tests {
    use crate::RecordTable;

    #[test]
    fn test_crud() {
        let mut sfs = RecordTable::init("user_key");

        sfs.create_record("dir1", None);
        sfs.create_record("dir1/file1", Some("Hello, World!".as_bytes().to_vec()));

        let files = sfs.read_directory_record("dir1");
        assert_eq!(sfs.get_size(&files[0]), 13);

        let file1 = String::from_utf8(sfs.read_file_record("dir1/file1")).unwrap();
        assert_eq!(file1, "Hello, World!");

        sfs.delete_record("dir1/file1");
        sfs.delete_record("dir1");

        sfs.close();
    }
}
