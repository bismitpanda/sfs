import {
    ClipboardCopy,
    Download,
    FilePlus,
    FolderPlus,
    FolderSearch2,
    FolderUp,
    Info,
    Link2,
    Pencil,
    Pin,
    SendHorizonal,
    Trash2,
    Upload,
} from "lucide-react";

import {
    useAppStateContext,
    useModalContext,
    useSelectedContext,
} from "../context";
import { ActionType, ModalEnum } from "../types";
import { createColor, deleteColor, dirActionColor, infoColor } from "../utils";
import { IconButton } from "./IconButton";

export const Navbar: React.FC = () => {
    const { selected, setSelected } = useSelectedContext();
    const { openModal } = useModalContext();
    const { dispatch } = useAppStateContext();

    return (
        <>
            <div className="navbar bg-[#1a1a1a] shadow-none rounded-lg">
                <div className="navbar-start gap-3">
                    <IconButton
                        icon={Pin}
                        color={dirActionColor}
                        tooltipBot="Pin Directory"
                        onClick={() => {
                            dispatch({
                                type: ActionType.PIN,
                                payload: selected[0],
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
                            icon={SendHorizonal}
                            color={deleteColor}
                            tooltipBot="Move To"
                        />
                        <IconButton
                            icon={Pencil}
                            color={deleteColor}
                            tooltipBot="Rename"
                        />
                        <IconButton
                            icon={Trash2}
                            color={deleteColor}
                            tooltipBot="Delete"
                            onClick={() => openModal(ModalEnum.DELETE)}
                        />
                        <IconButton
                            icon={ClipboardCopy}
                            color={infoColor}
                            tooltipBot="Copy"
                        />
                    </span>
                    <IconButton
                        icon={Info}
                        color={infoColor}
                        tooltipBot="Info"
                        onClick={() => openModal(ModalEnum.INFO)}
                    />
                    <IconButton
                        icon={Link2}
                        color={createColor}
                        tooltipBot="Create Link"
                    />
                    <IconButton
                        icon={Upload}
                        color={createColor}
                        tooltipBot="Export"
                    />
                    <IconButton
                        icon={Download}
                        color={createColor}
                        tooltipBot="Import"
                    />
                </div>
            </div>
        </>
    );
};
