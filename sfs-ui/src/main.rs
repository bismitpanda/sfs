#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;

use libsfs::{errors::Error, Record, RecordTable};
use tauri::{AppHandle, Manager, RunEvent, State, Window};

struct AppState {
    record_table: Mutex<RecordTable>,
}

#[tauri::command]
fn login(password: String, window: Window, handle: AppHandle) -> Result<(), Error> {
    handle.manage(AppState {
        record_table: Mutex::new(RecordTable::init(&password)?),
    });

    window.get_window("login").unwrap().close().unwrap();
    window.get_window("main").unwrap().show().unwrap();

    Ok(())
}

#[tauri::command]
fn delete(records: Vec<Record>, state: State<AppState>) -> Result<(), Error> {
    for record in records {
        state.record_table.lock().unwrap().delete(&record.name)?;
    }

    Ok(())
}

#[tauri::command]
fn unpin(record: Record, state: State<AppState>) {
    let mut record_table = state.record_table.lock().unwrap();
    record_table.unpin(record.id);
}

#[tauri::command]
fn pin(record: Record, state: State<AppState>) {
    let mut record_table = state.record_table.lock().unwrap();
    record_table.pin(record.id);
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

fn main() {
    let app = tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            login,
            delete,
            pin,
            unpin,
            create_file,
            create_directory
        ])
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    app.run(|app_handle, event| {
        if let RunEvent::ExitRequested { api, .. } = event {
            {
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
        }
    });
}
