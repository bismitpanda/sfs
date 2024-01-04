import { FileTable, Navbar, Sidebar, WorkingDir } from "./components";
import { ContextProvider } from "./context";
import mockData from "./mock.json";
import { Record } from "./types";

const mock = mockData as {
    path: string[];
    records: Record[];
    pinned: Record[];
    currDirRecord: Record;
};

const App: React.FC = () => (
    <ContextProvider
        initialAppState={{
            records: mock.records,
            workingDir: mock.path,
            pinned: mock.pinned,
            currDirRecord: mock.currDirRecord,
        }}
    >
        <div className="flex flex-row items-start">
            <Sidebar />
            <div className="flex grow flex-col w-full h-[100vh] py-4 px-5 gap-4">
                <Navbar />
                <WorkingDir />
                <FileTable />
            </div>
        </div>
    </ContextProvider>
);

export default App;
