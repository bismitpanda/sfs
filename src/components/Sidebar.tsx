import { exit } from "@tauri-apps/api/process";
import { Cog, Folder, FolderClock, LogOut, PieChart } from "lucide-react";

import { useAppStateContext, useModalContext } from "../context";
import { ModalEnum } from "../types";
import { deleteColor, folderActionColor, getIcon, infoColor } from "../utils";
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
                    <div className="w-full h-full py-4 text-sm text-[#aaa] flex flex-col">
                        <h2 className="px-4">Pinned</h2>
                        <div className="divider mt-0 px-4"></div>

                        {pinned.map((record, idx) => (
                            <div
                                className="flex flex-row gap-3 cursor-pointer px-6 py-4 relative hover:bg-[#282828] active:bg-[#222222] after:content-[''] after:absolute after:w-[calc(100%-40px)] last:after:h-0 after:h-[1px] hover:after:bottom-0 after:bg-[#282828] after:left-[20px] after:-bottom-[1px]  transition-colors duration-200"
                                key={idx}
                            >
                                {record.kind === "File" ? (
                                    getIcon(record.content.name)
                                ) : (
                                    <Folder size={18} strokeWidth={1} />
                                )}{" "}
                                {record.content.name}
                            </div>
                        ))}
                    </div>
                </section>
                <section className="sidebar-footer justify-end h-fit p-4">
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
