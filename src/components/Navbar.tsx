import { useAppStateContext } from "@hooks/useAppStateContext";
import { useModalContext } from "@hooks/useModalContext";
import { useSelectedContext } from "@hooks/useSelectedContext";
import { ActionType } from "@type/ActionType";
import { ModalEnum } from "@type/ModalEnum";
import {
    Download,
    FilePlus,
    FolderPlus,
    FolderSearch2,
    FolderUp,
    Info,
    Pin,
    PinOff,
    Trash2,
} from "lucide-react";

import {
    createColor,
    deleteColor,
    dirActionColor,
    infoColor,
} from "../utils/colors";
import { IconButton } from "./IconButton";

export const Navbar: React.FC = () => {
    const { selected, setSelected } = useSelectedContext();
    const { openModal } = useModalContext();
    const { dispatch, appState } = useAppStateContext();

    const isPinned = appState.pinned.some(
        (record) => record.id === appState.currDirRecord.id,
    );

    return (
        <div className="navbar bg-[#111] shadow-none rounded-lg">
            <div className="navbar-start gap-3">
                <IconButton
                    icon={isPinned ? PinOff : Pin}
                    color={dirActionColor}
                    tooltipBot={isPinned ? "Unpin Directory" : "Pin Directory"}
                    onClick={() => {
                        dispatch({
                            type: isPinned ? ActionType.UNPIN : ActionType.PIN,
                            payload: appState.currDirRecord,
                        });
                        setSelected([]);
                    }}
                />
                <IconButton
                    icon={FolderUp}
                    color={dirActionColor}
                    tooltipBot="Move Up"
                />
                <IconButton
                    icon={FolderPlus}
                    color={createColor}
                    tooltipBot="New Directory"
                    onClick={() => openModal(ModalEnum.NEW_DIRECTORY)}
                />
                <IconButton
                    icon={FilePlus}
                    color={createColor}
                    tooltipBot="New File"
                    onClick={() => openModal(ModalEnum.NEW_FILE)}
                />
                <IconButton
                    icon={FolderSearch2}
                    color={infoColor}
                    tooltipBot="Search"
                />
            </div>
            <div className="navbar-end gap-3">
                <span
                    className={`${
                        selected.length > 0 ? "opacity-100" : "opacity-0"
                    } flex flex-row gap-3 transition-all ease-in-out duration-200`}
                >
                    <IconButton
                        icon={Trash2}
                        color={deleteColor}
                        tooltipBot="Delete"
                        onClick={() => openModal(ModalEnum.DELETE)}
                    />
                </span>
                <IconButton
                    icon={Info}
                    color={infoColor}
                    tooltipBot="Info"
                    onClick={() => openModal(ModalEnum.INFO)}
                />
                <IconButton
                    icon={Download}
                    color={createColor}
                    tooltipBot="Import"
                    onClick={() => dispatch({ type: ActionType.IMPORT })}
                />
            </div>
        </div>
    );
};
