import { FileTable, Navbar, Sidebar, WorkingDir } from "./components";
import { Record } from "./components/FileTable";
import mockData from "./mock.json";

const mock = mockData as {
    selected: boolean;
    path: string[];
    records1: Record[];
    records2: Record[];
};

const App: React.FC = () => (
    <div className="flex flex-row items-start">
        <Sidebar />
        <div className="flex grow flex-col w-full h-[100vh] py-4 px-5 gap-4">
            <Navbar selected={mock.selected} />
            <WorkingDir path={mock.path} />
            <FileTable records={mock.records1} />
        </div>
    </div>
);

export default App;
