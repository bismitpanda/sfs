// ffffffffffffffffffffffffffffffff
// ||..........++++++++++----------
// -- accessed  modified  created

use chrono::{Datelike, NaiveDateTime, TimeZone, Timelike, Utc};
use rkyv::{Archive, Deserialize, Serialize};

const SIX_BITS_MASK: u64 = 0x3f;
const FIVE_BITS_MASK: u64 = 0x1f;
const FOUR_BITS_MASK: u64 = 0xf;
const FOURTEEN_BITS_MASK: u64 = 0x3fff;

impl From<FileTime> for NaiveDateTime {
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
        .naive_utc()
    }
}

impl From<NaiveDateTime> for FileTime {
    fn from(value: NaiveDateTime) -> Self {
        let year = value.year() as u64;
        let month = value.month() as u64;
        let day = value.day() as u64;

        let hour = value.hour() as u64;
        let min = value.minute() as u64;
        let sec = value.second() as u64;

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

pub struct FileTime(u64);

#[derive(Clone, Copy, Archive, Deserialize, Serialize)]
#[archive(check_bytes)]
pub struct FileTimes(u128);

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

    pub fn from_times(accessed: FileTime, modified: FileTime, created: FileTime) -> Self {
        let mut times = 0u128;

        times |= (accessed.0 & MASK) as u128;
        times <<= 40;

        times |= (modified.0 & MASK) as u128;
        times <<= 40;

        times |= (created.0 & MASK) as u128;
        times <<= 40;

        FileTimes(times)
    }
}

pub fn now() -> FileTimes {
    FileTimes::from_times(
        Utc::now().naive_utc().into(),
        Utc::now().naive_utc().into(),
        Utc::now().naive_utc().into(),
    )
}
