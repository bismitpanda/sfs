mod config;
pub mod errors;
mod filetime;
mod fs;

pub use fs::*;

#[cfg(test)]
mod tests {
    use crate::RecordTable;

    #[ignore]
    #[test]
    fn test_crud() {
        let mut sfs = RecordTable::init("user_key").unwrap();

        sfs.create("dir1", None).unwrap();
        sfs.create("dir1/file1", Some("Hello, World!".as_bytes().to_vec()))
            .unwrap();

        let files = sfs.read_directory("dir1").unwrap();
        assert_eq!(sfs.get_size(&files[0]).unwrap(), 13);

        let file1 = String::from_utf8(sfs.read_file("dir1/file1").unwrap()).unwrap();
        assert_eq!(file1, "Hello, World!");

        sfs.delete("dir1/file1").unwrap();
        sfs.delete("dir1").unwrap();

        sfs.close().unwrap();
    }
}
