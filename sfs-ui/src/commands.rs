use std::{path::PathBuf, sync::Mutex};

use argon2::{Argon2, PasswordHash, PasswordVerifier};
use libsfs::{config::Config, error::Result, Record, RecordTable};
use serde::Serialize;
use tauri::{api::path, AppHandle, Manager, State, Window, WindowBuilder, WindowUrl};

pub struct AppState {
    pub record_table: Mutex<RecordTable>,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
struct InitMeta {
    curr_dir_record: Record,
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
    let meta = record_table.meta();

    handle.manage(AppState {
        record_table: Mutex::new(record_table),
    });

    window.get_window("login").unwrap().close().unwrap();

    let main_window = window.get_window("main").unwrap();
    let (curr_dir_record, records, pinned) = meta.init_data()?;
    main_window
        .emit(
            "initialize",
            InitMeta {
                curr_dir_record,
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
pub fn create_file(name: &str, state: State<AppState>) -> Result<Record> {
    let mut record_table = state.record_table.lock().unwrap();
    record_table.create(name, Some(Vec::new()))
}

#[tauri::command]
pub fn create_directory(name: &str, state: State<AppState>) -> Result<Record> {
    let mut record_table = state.record_table.lock().unwrap();
    record_table.create(name, None)
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
pub async fn open_photo(record: usize, app: AppHandle) -> Result<()> {
    let photo_viewer_window =
        WindowBuilder::new(&app, "photo", WindowUrl::App("photo.html".into()))
            .build()
            .unwrap();

    let window_handle = photo_viewer_window.app_handle();
    photo_viewer_window.once("loaded", move |_| {
        window_handle
            .emit_to("photo", "image_load", record)
            .unwrap();
    });

    Ok(())
}
