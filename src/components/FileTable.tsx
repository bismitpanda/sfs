import {
    ArrowDownUp,
    ClipboardCopy,
    FileSymlink,
    Folder,
    FolderGit2,
    FolderSymlink,
    Info,
    Pencil,
    SendHorizonal,
    Trash2,
    Upload,
} from "lucide-react";
import { MouseEvent, useEffect, useState } from "react";

import {
    useAppStateContext,
    useModalContext,
    useSelectedContext,
} from "../hooks";
import { ActionType, MenuItemType, ModalEnum, Record } from "../types";
import { getIcon, humanFileSize } from "../utils";
import { ContextMenu } from "./ContextMenu";
import { TableRow } from "./TableRow";

export const FileTable: React.FC = () => {
    const { selected, setSelected } = useSelectedContext();
    const { appState, dispatch } = useAppStateContext();
    const { openModal } = useModalContext();

    const [menuState, setMenuState] = useState<{
        open: boolean;
        items: MenuItemType[];
        ev?: MouseEvent;
    }>({ open: false, items: [] });

    const getRow = (record: Record) => {
        switch (record.inner.tag) {
            case "File":
                return (
                    <TableRow
                        record={record}
                        date={record.file_times.modified}
                        size={humanFileSize(record.inner.size)}
                        icon={getIcon(record.name)}
                    />
                );

            case "Directory":
                return (
                    <TableRow
                        record={record}
                        date={record.file_times.modified}
                        size="-"
                        icon={record.name === ".git" ? FolderGit2 : Folder}
                    />
                );

            case "Symlink":
                return (
                    <TableRow
                        record={record}
                        date={record.file_times.modified}
                        size="-"
                        icon={
                            record.inner.is_file ? FileSymlink : FolderSymlink
                        }
                    />
                );
        }
    };

    const closeMenu = () =>
        setMenuState({
            items: [],
            open: false,
        });

    const getItems = (record: Record) => {
        return [
            {
                label: "Copy",
                icon: ClipboardCopy,
                onClick: () => console.log(record.name),
            },
            {
                label: "Rename",
                icon: Pencil,
                onClick: () => console.log("rename"),
            },
            {
                label: "Move To",
                icon: SendHorizonal,
                onClick: () => console.log("move"),
            },
            {
                label: "Export",
                icon: Upload,
                onClick: () =>
                    dispatch({ type: ActionType.EXPORT, payload: record }),
            },
            {
                label: "Delete",
                icon: Trash2,
                onClick: () =>
                    dispatch({
                        type: ActionType.DELETE,
                        payload: [record],
                    }),
            },
            {
                label: "Info",
                icon: Info,
                onClick: () => openModal(ModalEnum.INFO, record),
            },
        ];
    };

    const handleClick = () => {
        if (menuState.open) {
            closeMenu();
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClick);

        return () => document.removeEventListener("click", handleClick);
    }, []);

    return (
        <>
            <ContextMenu
                open={menuState.open}
                items={menuState.items}
                ev={menuState.ev}
                closeMenu={closeMenu}
            />
            <div
                className={`grid grid-row-2 w-full max-h-[calc(100%-104px)] ${
                    appState.records.length === 0 ? "" : "bg-[#1a1a1a]"
                } rounded-lg text-sm text-[#aaa]`}
            >
                {appState.records.length === 0 ? (
                    <div>Empty Directory</div>
                ) : (
                    <>
                        <div className="grid grid-cols-[50%_15%_auto] py-3 bg-inherit border-b-[3px] border-b-[#111] rounded-t-md">
                            <div className="flex flex-row gap-1 pl-3">
                                <input
                                    checked={
                                        selected.length ===
                                        appState.records.length
                                    }
                                    type="checkbox"
                                    className={`checkbox checkbox-sm pl-3 mr-11 transition-opacity duration-200 ${
                                        selected.length > 0
                                            ? "opacity-100"
                                            : "!opacity-0"
                                    }`}
                                    onChange={() => {
                                        if (selected.length > 0) {
                                            setSelected(
                                                selected.length <
                                                    appState.records.length
                                                    ? appState.records
                                                    : [],
                                            );
                                        }
                                    }}
                                />
                                Name
                                <ArrowDownUp size={14} strokeWidth={1} />
                            </div>
                            <div className="flex flex-row gap-1">
                                Size
                                <ArrowDownUp size={14} strokeWidth={1} />
                            </div>
                            <div className="flex flex-row gap-1">
                                Last Modified
                                <ArrowDownUp size={14} strokeWidth={1} />
                            </div>
                        </div>
                        <div
                            className="overflow-y-auto grid grid-cols-[51%_15%_auto]"
                            onScroll={() =>
                                setMenuState({
                                    items: [],
                                    open: false,
                                })
                            }
                        >
                            {appState.records.map((record, idx) => (
                                <div
                                    key={idx}
                                    className={`
                                    ${
                                        selected.some(
                                            (obj) => obj.id === record.id,
                                        )
                                            ? "bg-[#282828] after:bottom-0"
                                            : "after:-bottom-[1px]"
                                    } last:hover:rounded-b-md grid grid-cols-subgrid col-span-4 cursor-pointer pl-3 pr-10 py-4 relative hover:bg-[#282828] active:bg-[#222222] after:content-[''] after:absolute after:w-[calc(100%-60px)] last:after:h-0 after:h-[1px] hover:after:bottom-0 after:bg-[#282828] after:left-[30px] transition-all duration-200`}
                                    onClick={() =>
                                        selected.some(
                                            (obj) => obj.id === record.id,
                                        )
                                            ? setSelected((selected) =>
                                                  selected.filter(
                                                      (obj) =>
                                                          obj.id !== record.id,
                                                  ),
                                              )
                                            : setSelected((selected) => [
                                                  ...selected,
                                                  record,
                                              ])
                                    }
                                    onDoubleClick={() =>
                                        console.log(record.name)
                                    }
                                    onContextMenu={(ev) => {
                                        ev.preventDefault();
                                        menuState.open
                                            ? setMenuState({
                                                  items: [],
                                                  open: false,
                                              })
                                            : setMenuState({
                                                  items: getItems(record),
                                                  open: true,
                                                  ev,
                                              });
                                    }}
                                >
                                    {getRow(record)}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
