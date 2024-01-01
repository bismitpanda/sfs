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
import { useContext, useState } from "react";

import { SelectedContext } from "../contexts";
import {
    createColor,
    deleteColor,
    folderActionColor,
    infoColor,
} from "../utils";
import { IconButton } from "./IconButton";
import {
    DeleteModal,
    InfoModal,
    NewFileModal,
    NewFolderModal,
    SearchModal,
} from "./modals";

export const Navbar: React.FC = () => {
    const [search, setSearch] = useState(false);
    const [del, setDel] = useState(false);
    const [newFile, setNewFile] = useState(false);
    const [newFolder, setNewFolder] = useState(false);
    const [info, setInfo] = useState(false);
    const { selected } = useContext(SelectedContext);

    return (
        <>
            <SearchModal state={search} close={() => setSearch(false)} />
            <NewFileModal state={newFile} close={() => setNewFile(false)} />
            <NewFolderModal
                state={newFolder}
                close={() => setNewFolder(false)}
            />
            <InfoModal state={info} close={() => setInfo(false)} />
            <DeleteModal state={del} close={() => setDel(false)} />

            <div className="navbar bg-[#1a1a1a] shadow-none rounded-lg">
                <div className="navbar-start gap-3">
                    <IconButton
                        icon={FolderUp}
                        color={folderActionColor}
                        tooltipBot="Move Up"
                    />
                    <IconButton
                        icon={FolderSearch2}
                        color={infoColor}
                        tooltipBot="Search"
                        onClick={() => setSearch(true)}
                    />
                    <IconButton
                        icon={FolderPlus}
                        color={createColor}
                        tooltipBot="New Folder"
                        onClick={() => setNewFolder(true)}
                    />
                    <IconButton
                        icon={FilePlus}
                        color={createColor}
                        tooltipBot="New File"
                        onClick={() => setNewFile(true)}
                    />
                </div>
                <div className="navbar-end gap-3">
                    {typeof selected !== "undefined" && (
                        <>
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
                                onClick={() => setDel(true)}
                            />
                            <IconButton
                                icon={ClipboardCopy}
                                color={infoColor}
                                tooltipBot="Copy"
                            />
                        </>
                    )}
                    <IconButton
                        icon={Info}
                        color={infoColor}
                        tooltipBot="Info"
                        onClick={() => setInfo(true)}
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
