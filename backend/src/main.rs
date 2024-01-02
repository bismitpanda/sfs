#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;

use sfs::{Record, RecordTable};
use tauri::State;

#[tauri::command]
fn delete() {
    println!("called delete")
}

#[tauri::command]
fn pin(record: Record, state: State<AppState>) {
    let mut record_table = state.record_table.lock().unwrap();
    record_table.pin(&record);
    println!("{}", record.as_directory().name)
}

struct AppState {
    record_table: Mutex<RecordTable>,
}

fn main() {
    tauri::Builder::default()
        .manage(AppState {
            record_table: Mutex::new(RecordTable::new("user_key")),
        })
        .invoke_handler(tauri::generate_handler![delete, pin])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
