import { useAppStateContext } from "@hooks/useAppStateContext";
import { useModalContext } from "@hooks/useModalContext";
import { appWindow } from "@tauri-apps/api/window";
import { ActionType } from "@type/ActionType";
import { ModalEnum } from "@type/ModalEnum";
import { Record } from "@type/Record";
import { deleteColor, dirActionColor, infoColor } from "@utils/colors";
import { getIcon } from "@utils/getIcon";
import {
    Cog,
    Folder,
    LogOut,
    LucideIcon,
    PieChart,
    PinOff,
    Rocket,
} from "lucide-react";

import { IconButton } from "./IconButton";

export const Sidebar: React.FC = () => {
    const { openModal } = useModalContext();
    const { appState, dispatch } = useAppStateContext();

    const renderIcon = (tag: string, name: string) =>
        tag === "File" ? (
            ((Icon: LucideIcon) => <Icon size={18} strokeWidth={1} />)(
                getIcon(name),
            )
        ) : (
            <Folder size={18} strokeWidth={1} />
        );

    const handleOnUnpinClick = (record: Record) =>
        dispatch({
            type: ActionType.UNPIN,
            payload: record.id,
        });

    return (
        <aside className="sidebar resize-x w-1/4 h-[calc(100vh-32px)] border-r border-r-dark-300 justify-start bg-dark-50">
            <section className="sidebar-content pt-0">
                <div className="w-full h-full py-4 text-sm text-dark-900 flex flex-col">
                    <h2 className="px-4">Pinned</h2>
                    <div className="divider mt-0 px-4"></div>

                    <div className="overflow-auto">
                        {appState.pinned.map((record, idx) => (
                            <div
                                className="flex group flex-row justify-between items-center cursor-pointer px-6 py-2 relative hover:bg-dark-200 active:bg-dark-100 after:content-[''] after:absolute after:w-[calc(100%-40px)] last:after:h-0 after:h-[1px] hover:after:bottom-0 after:bg-dark-400 after:left-[20px] after:-bottom-[1px] transition-colors duration-200"
                                key={idx}
                            >
                                <span className="flex flex-row gap-3">
                                    {renderIcon(record.inner.tag, record.name)}{" "}
                                    {record.name}
                                </span>
                                <span
                                    className="group-hover:opacity-70 opacity-0 hover:bg-dark-400 active:!scale-[0.95] p-[10px] rounded-md transition duration-200"
                                    onClick={() => handleOnUnpinClick(record)}
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
                <div className="navbar bg-dark-50 border border-dark-300 shadow-none rounded-lg">
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
                        <span className="relative inline-flex">
                            <IconButton
                                icon={Rocket}
                                color={dirActionColor}
                                tooltipTop={`${
                                    appState.fileServerRunning
                                        ? "Stop"
                                        : "Launch"
                                } File Server`}
                                onClick={() =>
                                    dispatch({
                                        type: ActionType.SERVE,
                                        payload: !appState.fileServerRunning,
                                    })
                                }
                            />
                            {appState.fileServerRunning && (
                                <span className="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-300 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-400"></span>
                                </span>
                            )}
                        </span>
                        <IconButton
                            icon={LogOut}
                            color={deleteColor}
                            tooltipTop="Exit"
                            onClick={() => appWindow.close()}
                        />
                    </div>
                </div>
            </section>
        </aside>
    );
};
