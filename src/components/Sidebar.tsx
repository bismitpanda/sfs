import { exit } from "@tauri-apps/api/process";
import { Cog, FolderClock, LogOut, PieChart } from "lucide-react";

import { useAppStateContext, useModalContext } from "../context";
import { ModalEnum } from "../context/modal";
import { deleteColor, folderActionColor, infoColor } from "../utils";
import { IconButton } from "./IconButton";

export const Sidebar: React.FC = () => {
    const { openModal } = useModalContext();
    const {
        appState: { pinned },
    } = useAppStateContext();

    return (
        <>
            <aside className="sidebar h-screen justify-start bg-[#1a1a1a]">
                <section className="sidebar-content">
                    <div className="w-full h-full p-4">
                        <h2 className="text-sm text-[#aaa]">Pinned</h2>
                        <div className="divider mt-0"></div>

                        {pinned.map((record, idx) => (
                            <div key={idx}>{record.name}</div>
                        ))}
                    </div>
                </section>
                <section className="sidebar-footer justify-end h-fit overflow-visible p-4">
                    <div className="navbar bg-[#151515] shadow-none rounded-lg">
                        <div className="navbar-start justify-between">
                            <IconButton
                                icon={Cog}
                                color={infoColor}
                                tooltipTop="Settings"
                                onClick={() => openModal(ModalEnum.SETTINGS)}
                            />
                            <IconButton
                                icon={PieChart}
                                color={infoColor}
                                tooltipTop="Properties"
                                onClick={() => openModal(ModalEnum.PROPERTIES)}
                            />
                            <IconButton
                                icon={FolderClock}
                                color={folderActionColor}
                                tooltipTop="Recent"
                            />
                            <IconButton
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
