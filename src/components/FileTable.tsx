import { useAppStateContext } from "@hooks/useAppStateContext";
import { useModalContext } from "@hooks/useModalContext";
import { useSelectedContext } from "@hooks/useSelectedContext";
import { invoke } from "@tauri-apps/api";
import { ActionType } from "@type/ActionType";
import { MenuItemType } from "@type/MenuItemType";
import { ModalEnum } from "@type/ModalEnum";
import { Record } from "@type/Record";
import { getIcon } from "@utils/getIcon";
import { humanFileSize } from "@utils/humanFileSize";
import {
    ArrowDownUp,
    ClipboardCopy,
    FileSymlink,
    Folder,
    FolderGit2,
    FolderSymlink,
    Frown,
    Info,
    Pencil,
    Pin,
    PinOff,
    SendHorizonal,
    Trash2,
    Upload,
} from "lucide-react";
import { MouseEvent, useEffect, useState } from "react";

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
        const isPinned = appState.pinned.some((obj) => obj.id === record.id);

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
            isPinned
                ? {
                      label: "Unpin",
                      icon: PinOff,
                      onClick: () => {
                          dispatch({
                              type: ActionType.UNPIN,
                              payload: record,
                          });
                      },
                  }
                : {
                      label: "Pin",
                      icon: Pin,
                      onClick: () => {
                          dispatch({
                              type: ActionType.PIN,
                              payload: record,
                          });
                      },
                  },
        ];
    };

    useEffect(() => {
        const handleClick = () => {
            if (menuState.open) {
                closeMenu();
            }
        };

        document.addEventListener("click", handleClick);

        return () => document.removeEventListener("click", handleClick);
    }, [menuState.open]);

    return (
        <>
            <ContextMenu
                open={menuState.open}
                items={menuState.items}
                ev={menuState.ev}
                closeMenu={closeMenu}
            />
            <div
                className={`grid grid-row-2 w-full max-h-[calc(100%-110px)] ${
                    appState.records.length === 0 ? "" : "bg-dark-200"
                } rounded-lg text-sm text-dark-900`}
            >
                {appState.records.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-10 pt-20">
                        <Frown size={260} strokeWidth={1} color="#484848" />
                        <h2 className="text-3xl text-dark-800">
                            Seems lonely here...
                        </h2>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-[50%_15%_auto] py-3 bg-inherit border-b-[3px] border-b-dark-50 rounded-t-md">
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
                                            ? "bg-dark-400 after:bottom-0"
                                            : "after:-bottom-[1px]"
                                    } last:rounded-b-md grid grid-cols-subgrid col-span-4 cursor-pointer pl-3 pr-10 py-4 relative hover:bg-dark-400 active:bg-dark-300 after:content-[''] after:absolute after:w-[calc(100%-60px)] last:after:h-0 after:h-[1px] hover:after:bottom-0 after:bg-dark-400 after:left-[30px] transition-all duration-200`}
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
                                    onDoubleClick={async () => {
                                        if (
                                            record.name.split(".").at(-1) ===
                                            "png"
                                        ) {
                                            await invoke("open_photo", {
                                                record: record.id,
                                            });
                                        }
                                    }}
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
