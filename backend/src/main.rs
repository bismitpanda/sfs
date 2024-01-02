#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;

use sfs::RecordTable;
use tauri::State;

#[tauri::command]
fn delete() {
    println!("called delete")
}

#[tauri::command]
fn pin(state: State<AppState>) {
    let mut record_table = state.record_table.lock().unwrap();
    record_table.pin(0);
    println!("called pin")
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
