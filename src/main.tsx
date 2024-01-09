import { DropZone } from "@components/DropZone";
import { FileTable } from "@components/FileTable";
import { Navbar } from "@components/Navbar";
import { Sidebar } from "@components/Sidebar";
import { TitleBar } from "@components/TitleBar";
import { WorkingDir } from "@components/WorkingDir";
import { ContextProvider } from "@context/ContextProvider";
import { listen } from "@tauri-apps/api/event";
import { AppState } from "@type/AppState";
import { Record } from "@type/Record";
import { useEffect, useState } from "react";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const Main: React.FC = () => {
    const [appState, setAppState] = useState<AppState | null>(null);

    useEffect(() => {
        const unlisten = listen("initialize", ({ payload }) => {
            const state = payload as {
                workingDirRecord: Record;
                records: Record[];
                pinned: Record[];
            };
            setAppState({
                ...state,
                selected: [],
                workingDir: [],
                fileServerRunning: false,
            });
        });

        return () => {
            unlisten.then((f) => f());
        };
    }, []);

    return (
        <div className="rounded-3xl">
            <TitleBar />
            {appState && (
                <ContextProvider initialAppState={appState}>
                    <div className="flex flex-row items-start mt-8">
                        <Sidebar />
                        <div className="flex grow flex-col w-full h-[calc(100vh-32px)] py-4 px-5 gap-4">
                            <Navbar />
                            <WorkingDir />
                            <FileTable />
                        </div>
                    </div>
                    <DropZone />
                    <ToastContainer
                        position="bottom-right"
                        autoClose={1000}
                        hideProgressBar
                        closeOnClick
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="dark"
                        transition={Bounce}
                        newestOnTop
                    />
                </ContextProvider>
            )}
        </div>
    );
};

export default Main;
