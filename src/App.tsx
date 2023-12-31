import { Navbar, Sidebar, FileTable, WorkingDir } from "./components";
import { Record } from "./components/FileTable";
import mockData from "./mock.json";

const mock = mockData as {
    selected: boolean;
    path: string[];
    records: Record[];
};

const App: React.FC = () => (
    <div className="flex flex-row items-start">
        <Sidebar />
        <div className="flex flex-col w-full h-lvh py-4 px-5 gap-4">
            <Navbar selected={mock.selected} />
            <WorkingDir path={mock.path} />
            <FileTable records={mock.records} />
        </div>
    </div>
);

export default App;
