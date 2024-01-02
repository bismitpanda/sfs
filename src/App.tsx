import { FileTable, Navbar, Sidebar, WorkingDir } from "./components";
import { ContextProvider } from "./context";
import mockData from "./mock.json";
import { Record } from "./types";

const mock = mockData as {
    path: string[];
    records1: Record[];
    records2: Record[];
    pinned: Record[];
};

const App: React.FC = () => (
    <ContextProvider
        initialAppState={{
            records: mock.records1,
            workingDir: mock.path,
            pinned: mock.pinned,
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
