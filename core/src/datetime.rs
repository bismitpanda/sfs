// ffffffffffffffffffffffffffffffff
// ||..........++++++++++----------
// -- accessed  modified  created

use chrono::{DateTime, Datelike, TimeZone, Timelike, Utc};
use serde::{
    de::{self, MapAccess, Visitor},
    ser::SerializeStruct,
    Deserialize, Serialize, Serializer,
};

const SIX_BITS_MASK: u64 = 0x3f;
const FIVE_BITS_MASK: u64 = 0x1f;
const FOUR_BITS_MASK: u64 = 0xf;
const FOURTEEN_BITS_MASK: u64 = 0x3fff;

impl From<FileTime> for DateTime<Utc> {
    fn from(val: FileTime) -> Self {
        let sec = val.0 & SIX_BITS_MASK;
        let min = val.0 >> 6 & SIX_BITS_MASK;
        let hour = val.0 >> 12 & FIVE_BITS_MASK;

        let year = val.0 >> 17 & FOURTEEN_BITS_MASK;
        let month = val.0 >> 31 & FOUR_BITS_MASK;
        let day = val.0 >> 35 & FIVE_BITS_MASK;

        Utc.with_ymd_and_hms(
            year.try_into().unwrap(),
            month.try_into().unwrap(),
            day.try_into().unwrap(),
            hour.try_into().unwrap(),
            min.try_into().unwrap(),
            sec.try_into().unwrap(),
        )
        .unwrap()
    }
}

impl From<DateTime<Utc>> for FileTime {
    fn from(value: DateTime<Utc>) -> Self {
        let year = u64::from(value.year().unsigned_abs());
        let month = u64::from(value.month());
        let day = u64::from(value.day());

        let hour = u64::from(value.hour());
        let min = u64::from(value.minute());
        let sec = u64::from(value.second());

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
        file_times.serialize_field("accessed", &DateTime::<Utc>::from(self.accessed()))?;
        file_times.serialize_field("modified", &DateTime::<Utc>::from(self.modified()))?;
        file_times.serialize_field("created", &DateTime::<Utc>::from(self.created()))?;

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
        let mut accessed: Option<DateTime<Utc>> = None;
        let mut modified: Option<DateTime<Utc>> = None;
        let mut created: Option<DateTime<Utc>> = None;
        while let Some(key) = map.next_key()? {
            match key {
                Field::Accessed => {
                    if accessed.is_some() {
                        return Err(de::Error::duplicate_field("accessed"));
                    }
                    accessed = Some(map.next_value()?);
                }

                Field::Created => {
                    if created.is_some() {
                        return Err(de::Error::duplicate_field("created"));
                    }
                    created = Some(map.next_value()?);
                }

                Field::Modified => {
                    if modified.is_some() {
                        return Err(de::Error::duplicate_field("modified"));
                    }
                    modified = Some(map.next_value()?);
                }
            }
        }

        let accessed = accessed.ok_or_else(|| de::Error::missing_field("secs"))?;
        let modified = modified.ok_or_else(|| de::Error::missing_field("nanos"))?;
        let created = created.ok_or_else(|| de::Error::missing_field("nanos"))?;

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
        const FIELDS: &'static [&'static str] = &["accessed", "modified", "created"];
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
    FileTimes::from_times(Utc::now().into(), Utc::now().into(), Utc::now().into())
}
