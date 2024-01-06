import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import { FileTable, Navbar, Sidebar, WorkingDir } from "./components";
import { ContextProvider } from "./context";
import { AppState } from "./types";

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>({
        records: [],
        workingDir: [],
        pinned: [],
        currDirRecord: {
            name: "",
            id: 0,
            file_times: {
                accessed: {
                    year: 0,
                    month: 0,
                    day: 0,
                    minute: 0,
                    hour: 0,
                    second: 0,
                },
                modified: {
                    year: 0,
                    month: 0,
                    day: 0,
                    minute: 0,
                    hour: 0,
                    second: 0,
                },
                created: {
                    year: 0,
                    month: 0,
                    day: 0,
                    minute: 0,
                    hour: 0,
                    second: 0,
                },
            },
            inner: {
                tag: "Directory",
                entries: {},
            },
        },
    });

    useEffect(() => {
        invoke("initialize").then((state) =>
            setAppState({ ...state, workingDir: [] }),
        );
    }, []);

    return (
        <ContextProvider initialAppState={appState}>
            <div className="flex flex-row items-start">
                <Sidebar />
                <div className="flex grow flex-col w-full h-[100vh] py-4 px-5 gap-4">
                    <Navbar />
                    <WorkingDir />
                    <FileTable />
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </ContextProvider>
    );
};

export default App;
