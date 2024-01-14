import { useAppStateContext } from "@hooks/useAppStateContext";
import { useContextMenu } from "@hooks/useContextMenu";
import { ActionType } from "@type/ActionType";
import { Record } from "@type/Record";
import { getIcon } from "@utils/getIcon";
import { humanFileSize } from "@utils/humanFileSize";
import {
    ArrowDownUp,
    FileSymlink,
    Folder,
    FolderGit2,
    FolderSymlink,
    Frown,
} from "lucide-react";
import { KeyboardEvent, MouseEvent, useState } from "react";

import { ContextMenu } from "./ContextMenu";
import { TableRow } from "./TableRow";

export const FileTable: React.FC = () => {
    const { appState, dispatch } = useAppStateContext();
    const [editing, setEditing] = useState<number | null>(null);
    const [newName, setNewName] = useState("");
    const { handleOnContextMenu, closeMenu, menuProps } =
        useContextMenu(setEditing);

    const getRow = (record: Record) => {
        const defaultProps = {
            record,
            onInput: setNewName,
            editing: editing !== null && editing === record.id,
            date: record.file_times.modified,
        };

        switch (record.inner.tag) {
            case "File":
                return (
                    <TableRow
                        size={humanFileSize(record.inner.size)}
                        icon={getIcon(record.name)}
                        {...defaultProps}
                    />
                );

            case "Directory":
                return (
                    <TableRow
                        size="-"
                        icon={record.name === ".git" ? FolderGit2 : Folder}
                        {...defaultProps}
                    />
                );

            case "Symlink":
                return (
                    <TableRow
                        size="-"
                        icon={
                            record.inner.is_file ? FileSymlink : FolderSymlink
                        }
                        {...defaultProps}
                    />
                );
        }
    };

    const handleKeyPress = (ev: KeyboardEvent, record: Record) => {
        if (editing !== null && ev.key === "Enter" && record.name !== newName) {
            dispatch({
                type: ActionType.RENAME,
                payload: { newName, oldName: record.name },
            });
            setEditing(null);
        } else if (editing !== null && ev.key === "Escape") {
            setEditing(null);
        }
    };

    const handleRowClick = (ev: MouseEvent, record: Record) => {
        const selected = appState.selected.some((obj) => obj.id === record.id)
            ? appState.selected.filter((obj) => obj.id !== record.id)
            : ev.shiftKey || appState.selected.length > 1
              ? [...appState.selected, record]
              : [record];

        dispatch({ type: ActionType.SET_SELECTED, payload: selected });
    };

    const handleSelectAllChange = () => {
        if (appState.selected.length > 1) {
            dispatch({
                type: ActionType.SET_SELECTED,
                payload:
                    appState.selected.length < appState.records.length
                        ? appState.records
                        : [],
            });
        }
    };

    const handleDoubleClick = (record: Record) => {
        if (record.inner.tag === "Directory") {
            dispatch({
                type: ActionType.CHANGE_DIRECTORY,
                payload: {
                    id: record.id,
                    path: [
                        ...appState.workingDir,
                        {
                            name: record.name,
                            id: record.id,
                        },
                    ],
                },
            });
        }
    };

    return (
        <>
            <ContextMenu {...menuProps} />
            <div
                className={`grid grid-row-2 w-full max-h-[calc(100%-110px)] rounded-lg text-sm text-dark-900 select-none ${
                    appState.records.length === 0
                        ? ""
                        : "bg-dark-50 border border-dark-300"
                }`}
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
                        <div className="grid grid-cols-[50%_15%_auto] py-3 bg-inherit border-b border-b-dark-300 rounded-t-md">
                            <div className="flex flex-row gap-1 pl-3">
                                <input
                                    checked={
                                        appState.selected.length ===
                                        appState.records.length
                                    }
                                    type="checkbox"
                                    className={`checkbox checkbox-sm pl-3 mr-11 transition-opacity duration-200 ${
                                        appState.selected.length > 1
                                            ? "opacity-100"
                                            : "!opacity-0"
                                    }`}
                                    onChange={() => handleSelectAllChange()}
                                />
                                Name
                                <span>
                                    <ArrowDownUp size={14} strokeWidth={1} />
                                </span>
                            </div>
                            <div className="flex flex-row gap-1">
                                Size
                                <span>
                                    <ArrowDownUp size={14} strokeWidth={1} />
                                </span>
                            </div>
                            <div className="flex flex-row gap-1">
                                Last Modified
                                <span>
                                    <ArrowDownUp size={14} strokeWidth={1} />
                                </span>
                            </div>
                        </div>
                        <div
                            className="overflow-y-auto grid grid-cols-[51%_15%_auto]"
                            onScroll={() => closeMenu()}
                        >
                            {appState.records.map((record, idx) => (
                                <div
                                    onKeyDown={(ev) =>
                                        handleKeyPress(ev, record)
                                    }
                                    key={idx}
                                    className={`${
                                        appState.selected.some(
                                            (obj) => obj.id === record.id,
                                        )
                                            ? "bg-dark-100 after:bg-dark-100 after:bottom-0"
                                            : "after:-bottom-[1px] after:bg-dark-300 "
                                    } last:rounded-b-md grid grid-cols-subgrid col-span-4 cursor-pointer pl-3 pr-10 py-4 relative hover:bg-dark-200 active:bg-dark-100 after:content-[''] after:absolute after:w-[calc(100%-60px)] last:after:h-0 after:h-[1px] hover:after:h-0 after:left-[30px] transition-all duration-200`}
                                    onClick={(ev) => handleRowClick(ev, record)}
                                    onDoubleClick={() =>
                                        handleDoubleClick(record)
                                    }
                                    onContextMenu={(ev) =>
                                        handleOnContextMenu(ev, record)
                                    }
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
