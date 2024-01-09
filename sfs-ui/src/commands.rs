use std::{path::PathBuf, sync::Mutex};

use argon2::{Argon2, PasswordHash, PasswordVerifier};
use libsfs::{config::Config, error::Result, Record, RecordTable};
use serde::Serialize;
use tauri::{api::path, AppHandle, Manager, State, Window};

pub struct AppState {
    pub record_table: Mutex<RecordTable>,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
struct InitMeta {
    working_dir_record: Record,
    records: Vec<Record>,
    pinned: Vec<Record>,
}

#[tauri::command]
pub fn check_password(password: String) -> Result<()> {
    let key_path = Config::new(&path::home_dir().unwrap().join(".sfs"))?.key;

    if key_path.exists() {
        let key_contents = std::fs::read_to_string(key_path)?;
        let parsed_hash = PasswordHash::new(&key_contents)?;
        Ok(Argon2::default().verify_password(password.as_bytes(), &parsed_hash)?)
    } else {
        Ok(())
    }
}

#[tauri::command]
pub fn login(password: String, window: Window, handle: AppHandle) -> Result<()> {
    let record_table = RecordTable::init(&password, &path::home_dir().unwrap().join(".sfs"))?;
    let (working_dir_record, records) = record_table.get_dir_entries(0)?;
    let pinned = record_table.get_pinned();

    handle.manage(AppState {
        record_table: Mutex::new(record_table),
    });

    window.get_window("login").unwrap().close().unwrap();

    let main_window = window.get_window("main").unwrap();
    main_window
        .emit(
            "initialize",
            InitMeta {
                working_dir_record,
                records,
                pinned,
            },
        )
        .unwrap();
    main_window.show().unwrap();

    Ok(())
}

#[tauri::command]
pub fn delete(records: Vec<usize>, state: State<AppState>) -> Result<()> {
    for record_id in records {
        state.record_table.lock().unwrap().delete(record_id)?;
    }

    Ok(())
}

#[tauri::command]
pub fn unpin(record: usize, state: State<AppState>) {
    let mut record_table = state.record_table.lock().unwrap();
    record_table.unpin(record);
}

#[tauri::command]
pub fn pin(record: usize, state: State<AppState>) {
    let mut record_table = state.record_table.lock().unwrap();
    record_table.pin(record);
}

#[tauri::command]
pub fn create(name: String, file: bool, state: State<AppState>) -> Result<Record> {
    let mut record_table = state.record_table.lock().unwrap();
    record_table.create(&name, file.then(Vec::new))
}

#[tauri::command]
pub fn import(files: Vec<String>, state: State<AppState>) -> Result<Vec<Record>> {
    let mut imported = Vec::with_capacity(files.len());

    for path in files {
        let data = std::fs::read(&path)?;
        imported.push(state.record_table.lock().unwrap().create(
            PathBuf::from(&path).file_name().unwrap().to_str().unwrap(),
            Some(data),
        )?);
    }

    Ok(imported)
}

#[tauri::command]
pub fn export(record: usize, file: String, state: State<AppState>) -> Result<()> {
    let data = state.record_table.lock().unwrap().read_file(record)?;

    std::fs::write(file, data)?;

    Ok(())
}

#[tauri::command]
pub fn rename(new_name: String, old_name: String, state: State<AppState>) -> Result<()> {
    state
        .record_table
        .lock()
        .unwrap()
        .rename(&old_name, &new_name)
}

#[tauri::command]
pub fn request(record: usize, state: State<AppState>) -> Result<(Record, Vec<Record>)> {
    state
        .record_table
        .lock()
        .unwrap()
        .set_working_dir_id(record);
    state.record_table.lock().unwrap().get_dir_entries(record)
}
