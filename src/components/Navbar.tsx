import {
    ClipboardCopy,
    Download,
    FilePlus,
    FolderPlus,
    FolderSearch2,
    FolderUp,
    Info,
    Pencil,
    Pin,
    SendHorizonal,
    Trash2,
    Upload,
} from "lucide-react";

import { useModalContext, useSelectedContext } from "../context";
import { ModalEnum } from "../types";
import {
    createColor,
    deleteColor,
    folderActionColor,
    infoColor,
} from "../utils";
import { IconButton } from "./IconButton";

export const Navbar: React.FC = () => {
    const { selected } = useSelectedContext();
    const { openModal } = useModalContext();

    return (
        <>
            <div className="navbar bg-[#1a1a1a] shadow-none rounded-lg">
                <div className="navbar-start gap-3">
                    <IconButton
                        icon={Pin}
                        color={folderActionColor}
                        tooltipBot="Pin Folder"
                    />
                    <IconButton
                        icon={FolderUp}
                        color={folderActionColor}
                        tooltipBot="Move Up"
                    />
                    <IconButton
                        icon={FolderPlus}
                        color={createColor}
                        tooltipBot="New Folder"
                        onClick={() => openModal(ModalEnum.NEW_FOLDER)}
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
