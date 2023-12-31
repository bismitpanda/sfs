import { Cog, FolderClock, LogOut, PieChart } from "lucide-react";

export const Sidebar: React.FC = () => (
    <aside className="sidebar h-screen justify-start">
        <section className="sidebar-content"></section>
        <section className="sidebar-footer justify-end h-fit min-h-[20rem] overflow-visible px-4 pb-3">
            <div className="navbar bg-[#222] shadow-none rounded-lg">
                <div className="navbar-start justify-between">
                    <div className="navbar-item bg-[#333] aspect-square p-2 hover:opacity-75 active:opacity-70 active:!scale-[0.97]">
                        <Cog size={18} strokeWidth={1} />
                    </div>
                    <div className="navbar-item bg-[#333] aspect-square p-2 hover:opacity-75 active:opacity-70 active:!scale-[0.97]">
                        <PieChart size={18} strokeWidth={1} />
                    </div>
                    <div className="navbar-item bg-[#333] aspect-square p-2 hover:opacity-75 active:opacity-70 active:!scale-[0.97]">
                        <FolderClock size={18} strokeWidth={1} />
                    </div>
                    <div className="navbar-item bg-[#333] aspect-square p-2 hover:opacity-75 active:opacity-70 active:!scale-[0.97]">
                        <LogOut size={18} strokeWidth={1} />
                    </div>
                </div>
            </div>
        </section>
    </aside>
);
