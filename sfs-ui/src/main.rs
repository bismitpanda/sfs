#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

use commands::*;
use tauri::{Manager, RunEvent};

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
            request
        ])
        .setup(|_app| {
            #[cfg(debug_assertions)]
            _app.get_window("main").unwrap().open_devtools();

            Ok(())
        })
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
