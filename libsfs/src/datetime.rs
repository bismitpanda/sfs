// ffffffffffffffffffffffffffffffff
// ||..........++++++++++----------
// -- accessed  modified  created

use chrono::{Datelike, Timelike, Utc};
use serde::{
    de::{Error, MapAccess, Visitor},
    ser::SerializeStruct,
    Deserialize, Serialize, Serializer,
};

const SIX_BITS_MASK: u64 = 0x3f;
const FIVE_BITS_MASK: u64 = 0x1f;
const FOUR_BITS_MASK: u64 = 0xf;
const FOURTEEN_BITS_MASK: u64 = 0x3fff;

#[derive(Serialize, Deserialize, Clone, Copy)]
struct DateTime {
    year: u64,
    month: u64,
    day: u64,
    hour: u64,
    min: u64,
    sec: u64,
}

impl DateTime {
    fn now() -> Self {
        let now_dt = Utc::now();

        Self {
            year: now_dt.year().try_into().unwrap(),
            month: now_dt.month().into(),
            day: now_dt.day().into(),
            hour: now_dt.hour().into(),
            min: now_dt.minute().into(),
            sec: now_dt.second().into(),
        }
    }
}

impl From<FileTime> for DateTime {
    fn from(val: FileTime) -> Self {
        let sec = val.0 & SIX_BITS_MASK;
        let min = val.0 >> 6 & SIX_BITS_MASK;
        let hour = val.0 >> 12 & FIVE_BITS_MASK;

        let year = val.0 >> 17 & FOURTEEN_BITS_MASK;
        let month = val.0 >> 31 & FOUR_BITS_MASK;
        let day = val.0 >> 35 & FIVE_BITS_MASK;

        Self {
            year,
            month,
            day,
            hour,
            min,
            sec,
        }
    }
}

impl From<DateTime> for FileTime {
    fn from(value: DateTime) -> Self {
        let year = value.year;
        let month = value.month;
        let day = value.day;

        let hour = value.hour;
        let min = value.min;
        let sec = value.sec;

        let mut dt = 0;

        dt |= sec;
        dt |= min << 6;
        dt |= hour << 12;

        dt |= year << 17;
        dt |= month << 31;
        dt |= day << 35;

        Self(dt)
    }
}

const MASK: u64 = 0xff_ffff_ffff;
const MASK_128: u128 = 0xff_ffff_ffff;

#[derive(Clone, Copy)]
pub struct FileTime(u64);

#[derive(Clone, Copy, rkyv::Archive, rkyv::Deserialize, rkyv::Serialize)]
#[archive(check_bytes)]
pub struct FileTimes(u128);

impl Serialize for FileTimes {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut file_times = serializer.serialize_struct("FileTimes", 3)?;
        file_times.serialize_field("accessed", &DateTime::from(self.accessed()))?;
        file_times.serialize_field("modified", &DateTime::from(self.modified()))?;
        file_times.serialize_field("created", &DateTime::from(self.created()))?;

        file_times.end()
    }
}

struct FileTimesVisitor;

impl<'de> Visitor<'de> for FileTimesVisitor {
    type Value = FileTimes;

    fn expecting(&self, formatter: &mut std::fmt::Formatter) -> std::fmt::Result {
        formatter.write_str("a valid file times struct")
    }

    fn visit_map<V>(self, mut map: V) -> Result<FileTimes, V::Error>
    where
        V: MapAccess<'de>,
    {
        let mut accessed: Option<DateTime> = None;
        let mut modified: Option<DateTime> = None;
        let mut created: Option<DateTime> = None;
        while let Some(key) = map.next_key()? {
            match key {
                Field::Accessed => {
                    if accessed.is_some() {
                        return Err(Error::duplicate_field("accessed"));
                    }
                    accessed = Some(map.next_value()?);
                }

                Field::Created => {
                    if created.is_some() {
                        return Err(Error::duplicate_field("created"));
                    }
                    created = Some(map.next_value()?);
                }

                Field::Modified => {
                    if modified.is_some() {
                        return Err(Error::duplicate_field("modified"));
                    }
                    modified = Some(map.next_value()?);
                }
            }
        }

        let accessed = accessed.ok_or_else(|| Error::missing_field("secs"))?;
        let modified = modified.ok_or_else(|| Error::missing_field("nanos"))?;
        let created = created.ok_or_else(|| Error::missing_field("nanos"))?;

        Ok(FileTimes::from_times(
            accessed.into(),
            modified.into(),
            created.into(),
        ))
    }
}

#[derive(Deserialize)]
#[serde(field_identifier, rename_all = "lowercase")]
enum Field {
    Accessed,
    Modified,
    Created,
}

impl<'de> Deserialize<'de> for FileTimes {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        const FIELDS: &[&str] = &["accessed", "modified", "created"];
        deserializer.deserialize_struct("FileTimes", FIELDS, FileTimesVisitor)
    }
}

impl FileTimes {
    pub const fn accessed(self) -> FileTime {
        FileTime((self.0 >> 80 & MASK_128) as u64)
    }

    pub const fn modified(self) -> FileTime {
        FileTime((self.0 >> 40 & MASK_128) as u64)
    }

    pub const fn created(self) -> FileTime {
        FileTime((self.0 & MASK_128) as u64)
    }

    pub const fn from_times(accessed: FileTime, modified: FileTime, created: FileTime) -> Self {
        let mut times = 0u128;

        times |= (accessed.0 & MASK) as u128;
        times <<= 40;

        times |= (modified.0 & MASK) as u128;
        times <<= 40;

        times |= (created.0 & MASK) as u128;
        times <<= 40;

        Self(times)
    }
}

pub fn now() -> FileTimes {
    FileTimes::from_times(
        DateTime::now().into(),
        DateTime::now().into(),
        DateTime::now().into(),
    )
}
