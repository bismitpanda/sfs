use std::path::{Path, PathBuf};

use crate::error::Result;

#[derive(Clone)]
pub struct Config {
    pub key: PathBuf,
    pub storage: PathBuf,
    pub meta: PathBuf,
    pub crypt: PathBuf,
}

impl Config {
    pub fn new(base: &Path) -> Result<Self> {
        Ok(Self {
            key: base.join("sfs.id"),
            storage: base.join("sfs.db"),
            meta: base.join("sfs.meta"),
            crypt: base.join("sfs.crypt"),
        })
    }
}
