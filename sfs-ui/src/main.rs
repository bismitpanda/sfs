#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

use std::sync::Mutex;

#[allow(clippy::wildcard_imports)]
use commands::*;
use libsfs::RecordTable;
use tauri::{async_runtime::Sender, Manager, RunEvent};

pub struct RecordTableState(Mutex<RecordTable>);
pub struct SenderState(Mutex<Sender<()>>);

fn main() {
    let app = tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            check_password,
            login,
            delete,
            pin,
            unpin,
            create,
            import,
            export,
            rename,
            request,
            send,
            serve,
        ])
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    app.run(|app_handle, event| {
        if let RunEvent::ExitRequested { api, .. } = event {
            api.prevent_exit();
            app_handle
                .state::<RecordTableState>()
                .0
                .lock()
                .unwrap()
                .close()
                .unwrap();

            app_handle.exit(0);
        }
    });
}
