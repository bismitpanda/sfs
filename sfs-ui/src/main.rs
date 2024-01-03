#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;

use libsfs::{Record, RecordTable};
use tauri::{Manager, RunEvent, State};

#[tauri::command]
fn delete(records: Vec<Record>, state: State<AppState>) {
    let mut record_table = state.record_table.lock().unwrap();
    for record in records {
        record_table.delete_record(&record.name());
    }
}

#[tauri::command]
fn unpin(record: Record, state: State<AppState>) {
    let mut record_table = state.record_table.lock().unwrap();
    record_table.unpin(record.id());
}

#[tauri::command]
fn pin(record: Record, state: State<AppState>) {
    let mut record_table = state.record_table.lock().unwrap();
    record_table.pin(record.id());
}

#[tauri::command]
fn create_file(name: &str, state: State<AppState>) -> Record {
    let mut record_table = state.record_table.lock().unwrap();
    record_table.create_record(name, Some(Vec::new()))
}

#[tauri::command]
fn create_directory(name: &str, state: State<AppState>) -> Record {
    let mut record_table = state.record_table.lock().unwrap();
    record_table.create_record(name, None)
}

struct AppState {
    record_table: Mutex<RecordTable>,
}

fn main() {
    let app = tauri::Builder::default()
        .setup(|app_handle| {
            app_handle.manage(AppState {
                record_table: Mutex::new(RecordTable::init("user_key")),
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
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
                    .close();
                app_handle.exit(0);
            }
        }
    })
}
