import { FileTable } from "@components/FileTable";
import { Navbar } from "@components/Navbar";
import { Sidebar } from "@components/Sidebar";
import { WorkingDir } from "@components/WorkingDir";
import { ContextProvider } from "@context/ContextProvider";
import { listen } from "@tauri-apps/api/event";
import { AppState } from "@type/AppState";
import { Record } from "@type/Record";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState | null>(null);

    useEffect(() => {
        listen("initialize", ({ payload }) => {
            const state = payload as {
                currDirRecord: Record;
                records: Record[];
                pinned: Record[];
            };
            setAppState({ ...state, workingDir: [] });
        });
    }, []);

    return (
        <>
            {appState && (
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
                        autoClose={1500}
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
            )}
        </>
    );
};

export default App;
