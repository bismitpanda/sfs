import { exit } from "@tauri-apps/api/process";
import {
    Cog,
    Folder,
    FolderClock,
    LogOut,
    PieChart,
    PinOff,
} from "lucide-react";

import { useAppStateContext, useModalContext } from "../context";
import { ActionType, ModalEnum } from "../types";
import { deleteColor, dirActionColor, getIcon, infoColor } from "../utils";
import { IconButton } from "./IconButton";

export const Sidebar: React.FC = () => {
    const { openModal } = useModalContext();
    const {
        appState: { pinned },
        dispatch,
    } = useAppStateContext();

    return (
        <>
            <aside className="sidebar h-screen justify-start bg-[#1a1a1a]">
                <section className="sidebar-content">
                    <div className="w-full h-full py-4 text-sm text-[#aaa] flex flex-col">
                        <h2 className="px-4">Pinned</h2>
                        <div className="divider mt-0 px-4"></div>

                        <div className="overflow-auto">
                            {pinned.map((record, idx) => (
                                <div
                                    className="flex group flex-row justify-between items-center cursor-pointer px-6 py-2 relative hover:bg-[#282828] active:bg-[#222222] after:content-[''] after:absolute after:w-[calc(100%-40px)] last:after:h-0 after:h-[1px] hover:after:bottom-0 after:bg-[#282828] after:left-[20px] after:-bottom-[1px] transition-colors duration-200"
                                    key={idx}
                                >
                                    <span className="flex flex-row gap-3">
                                        {record.kind === "File" ? (
                                            getIcon(record.content.name)
                                        ) : (
                                            <Folder size={18} strokeWidth={1} />
                                        )}{" "}
                                        {record.content.name}
                                    </span>
                                    <span
                                        className="group-hover:opacity-70 opacity-0 hover:bg-[#383838] active:!scale-[0.95] p-[10px] rounded-md transition duration-200"
                                        onClick={() =>
                                            dispatch({
                                                type: ActionType.UNPIN,
                                                payload: record,
                                            })
                                        }
                                    >
                                        <PinOff
                                            size={16}
                                            strokeWidth={1}
                                            color={deleteColor}
                                        />
                                    </span>
                                </div>
                            ))}
                        </div>
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
                                color={dirActionColor}
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
