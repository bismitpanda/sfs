#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{path::PathBuf, sync::Mutex};

use libsfs::{errors::Error, Record, RecordTable};
use serde::Serialize;
use tauri::{AppHandle, Manager, RunEvent, State, Window};

struct AppState {
    record_table: Mutex<RecordTable>,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
struct InitMeta {
    curr_dir_record: Record,
    records: Vec<Record>,
    pinned: Vec<Record>,
}

#[tauri::command]
fn login(password: String, window: Window, handle: AppHandle) -> Result<(), Error> {
    let record_table = RecordTable::init(&password)?;
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
fn delete(records: Vec<usize>, state: State<AppState>) -> Result<(), Error> {
    for record_id in records {
        state.record_table.lock().unwrap().delete(record_id)?;
    }

    Ok(())
}

#[tauri::command]
fn unpin(record: usize, state: State<AppState>) {
    let mut record_table = state.record_table.lock().unwrap();
    record_table.unpin(record);
}

#[tauri::command]
fn pin(record: usize, state: State<AppState>) {
    let mut record_table = state.record_table.lock().unwrap();
    record_table.pin(record);
}

#[tauri::command]
fn create_file(name: &str, state: State<AppState>) -> Result<Record, Error> {
    let mut record_table = state.record_table.lock().unwrap();
    record_table.create(name, Some(Vec::new()))
}

#[tauri::command]
fn create_directory(name: &str, state: State<AppState>) -> Result<Record, Error> {
    let mut record_table = state.record_table.lock().unwrap();
    record_table.create(name, None)
}

#[tauri::command]
fn import(files: Vec<String>, state: State<AppState>) -> Result<Vec<Record>, Error> {
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
fn export(record: usize, file: String, state: State<AppState>) -> Result<(), Error> {
    let data = state.record_table.lock().unwrap().read_file(record)?;

    std::fs::write(file, data)?;

    Ok(())
}

fn main() {
    let app = tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            login,
            delete,
            pin,
            unpin,
            create_file,
            create_directory,
            import,
            export
        ])
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    app.run(|app_handle, event| {
        if let RunEvent::ExitRequested { api, .. } = event {
            api.prevent_exit();
            app_handle
                .state::<AppState>()
                .record_table
                .lock()
                .unwrap()
                .close()
                .unwrap();

            app_handle.exit(0);
        }
    });
}
