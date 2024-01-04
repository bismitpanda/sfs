use std::convert::Infallible;

use rkyv::{
    bytecheck::StructCheckError,
    de::deserializers::SharedDeserializeMapError,
    ser::serializers::{AllocScratchError, CompositeSerializerError, SharedSerializeMapError},
    validation::{
        validators::{CheckDeserializeError, DefaultValidatorError},
        CheckArchiveError,
    },
};
use serde::{Serialize, Serializer};
use snafu::Snafu;

pub type Result<T, E = Error> = std::result::Result<T, E>;

#[derive(Debug, Snafu)]
#[snafu(visibility(pub), context(suffix(Error)))]
pub enum Error {
    #[snafu(display("{name} is not a file"))]
    NotFile { name: String },

    #[snafu(display("{name} is not a directory"))]
    NotDirectory { name: String },

    #[snafu(display("{name} not found"))]
    NotFound { name: String },

    #[snafu(display("argon2 hash error"), context(false))]
    Argon2 { source: argon2::Error },

    #[snafu(display("io error: {source}"), context(false))]
    Io { source: std::io::Error },

    #[snafu(display("fs error [path: {path}]: {source}"))]
    Fs {
        source: std::io::Error,
        path: String,
    },

    #[snafu(display("error during encryption/decryption"), context(false))]
    Aes { source: aes_gcm::Error },

    #[snafu(display("error during deserialization of archive"), context(false))]
    RkyvDeserialize {
        source: CheckDeserializeError<
            CheckArchiveError<StructCheckError, DefaultValidatorError>,
            SharedDeserializeMapError,
        >,
    },

    #[snafu(display("error during serialization of struct"), context(false))]
    RkyvSerialize {
        source: CompositeSerializerError<Infallible, AllocScratchError, SharedSerializeMapError>,
    },

    #[snafu(display("error during compression/decompression"), context(false))]
    Snap { source: snap::Error },

    #[snafu(display("The data is corrupted, name: {name}, id: {id}"))]
    CorruptedData { name: String, id: usize },
}

impl Serialize for Error {
    fn serialize<S>(&self, s: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        s.serialize_str(&self.to_string())
    }
}
