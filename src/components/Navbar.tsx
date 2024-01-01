import {
    ClipboardCopy,
    Download,
    FilePlus,
    FolderPlus,
    FolderSearch2,
    FolderUp,
    Info,
    Pencil,
    SendHorizonal,
    Trash2,
    Upload,
} from "lucide-react";
import { useState } from "react";

import {
    createColor,
    deleteColor,
    folderActionColor,
    infoColor,
} from "../utils";
import { NavIcon } from "./NavIcon";
import {
    NewFileModal,
    NewFolderModal,
    RenameModal,
    SearchModal,
} from "./modals";

export const Navbar: React.FC<{ selected?: boolean }> = ({ selected }) => {
    const [search, setSearch] = useState(false);
    const [rename, setRename] = useState(false);
    const [newFile, setNewFile] = useState(false);
    const [newFolder, setNewFolder] = useState(false);

    return (
        <>
            <SearchModal checked={search} onClick={() => setSearch(false)} />
            <RenameModal checked={rename} onClick={() => setRename(false)} />
            <NewFileModal checked={newFile} onClick={() => setNewFile(false)} />
            <NewFolderModal
                checked={newFolder}
                onClick={() => setNewFolder(false)}
            />

            <div className="navbar bg-[#1a1a1a] shadow-none rounded-lg">
                <div className="navbar-start gap-3">
                    <NavIcon
                        icon={FolderUp}
                        color={folderActionColor}
                        tooltipBot="Move Up"
                    />
                    <NavIcon
                        icon={FolderSearch2}
                        color={infoColor}
                        tooltipBot="Search"
                    />
                    <NavIcon
                        icon={FolderPlus}
                        color={createColor}
                        tooltipBot="New Folder"
                    />
                    <NavIcon
                        icon={FilePlus}
                        color={createColor}
                        tooltipBot="New File"
                    />
                </div>
                <div className="navbar-end gap-3">
                    {selected && (
                        <>
                            <NavIcon
                                icon={SendHorizonal}
                                color={deleteColor}
                                tooltipBot="Move To"
                            />
                            <NavIcon
                                icon={Pencil}
                                color={deleteColor}
                                tooltipBot="Rename"
                            />
                            <NavIcon
                                icon={Trash2}
                                color={deleteColor}
                                tooltipBot="Delete"
                            />
                            <NavIcon
                                icon={ClipboardCopy}
                                color={infoColor}
                                tooltipBot="Copy"
                            />
                        </>
                    )}
                    <NavIcon icon={Info} color={infoColor} tooltipBot="Info" />
                    <NavIcon
                        icon={Upload}
                        color={createColor}
                        tooltipBot="Export"
                    />
                    <NavIcon
                        icon={Download}
                        color={createColor}
                        tooltipBot="Import"
                    />
                </div>
            </div>
        </>
    );
};
