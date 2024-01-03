use std::path::PathBuf;

pub struct Config {
    pub storage: PathBuf,
    pub meta: PathBuf,
    pub crypt: PathBuf,
}

impl Config {
    pub fn new() -> Self {
        let base = PathBuf::from(".");
        Self {
            storage: base.join("sfs.db"),
            meta: base.join("sfs.meta"),
            crypt: base.join("sfs.crypt"),
        }
    }
}
