import { useState } from "react";

import { FileTable, Navbar, Sidebar, WorkingDir } from "./components";
import { Record } from "./components/FileTable";
import { SelectedContext } from "./contexts";
import mockData from "./mock.json";

const mock = mockData as {
    path: string[];
    records1: Record[];
    records2: Record[];
};

const App: React.FC = () => {
    const [selected, setSelected] = useState<number>();

    return (
        <div className="flex flex-row items-start">
            <Sidebar />
            <div className="flex grow flex-col w-full h-[100vh] py-4 px-5 gap-4">
                <SelectedContext.Provider value={{ selected, setSelected }}>
                    <Navbar />
                    <WorkingDir path={mock.path} />
                    <FileTable records={mock.records1} />
                </SelectedContext.Provider>
            </div>
        </div>
    );
};

export default App;
