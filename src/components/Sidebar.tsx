import { exit } from "@tauri-apps/api/process";
import { Cog, FolderClock, LogOut, PieChart } from "lucide-react";
import { useState } from "react";

import { deleteColor, folderActionColor, infoColor } from "../utils";
import { NavIcon } from "./NavIcon";
import { PropertiesModal, SettingsModal } from "./modals";

export const Sidebar: React.FC = () => {
    const [properties, setProperties] = useState(false);
    const [settings, setSetings] = useState(false);

    return (
        <>
            <PropertiesModal
                checked={properties}
                onClick={() => setProperties(false)}
            />
            <SettingsModal
                checked={settings}
                onClick={() => setSetings(false)}
            />
            <aside className="sidebar h-screen justify-start bg-[#1a1a1a]">
                <section className="sidebar-content"></section>
                <section className="sidebar-footer justify-end h-fit min-h-[20rem] overflow-visible px-4 pb-3">
                    <div className="navbar bg-[#151515] shadow-none rounded-lg">
                        <div className="navbar-start justify-between">
                            <NavIcon
                                icon={Cog}
                                color={infoColor}
                                tooltipTop="Settings"
                                onClick={() => setSetings(true)}
                            />
                            <NavIcon
                                icon={PieChart}
                                color={infoColor}
                                tooltipTop="Properties"
                                onClick={() => setProperties(true)}
                            />
                            <NavIcon
                                icon={FolderClock}
                                color={folderActionColor}
                                tooltipTop="Recent"
                            />
                            <NavIcon
                                icon={LogOut}
                                color={deleteColor}
                                tooltipTop="Exit"
                                onClick={() => exit(0)}
                            />
                        </div>
                    </div>
                </section>
            </aside>
        </>
    );
};
