import { invoke } from "@tauri-apps/api";
import { open, save } from "@tauri-apps/api/dialog";
import { Action } from "@type/Action";
import { ActionType } from "@type/ActionType";
import { Record } from "@type/Record";
import { Dispatch, useCallback } from "react";
import { toast } from "react-toastify";

export const useAsyncDispatch = (dispatch: Dispatch<Action>) =>
    useCallback(
        async (action: Action) => {
            switch (action.type) {
                case ActionType.DELETE: {
                    const display =
                        action.payload.length > 1
                            ? ` ${action.payload.length} files`
                            : ` "${action.payload[0]?.name}"`;

                    await toast.promise(
                        invoke("delete", {
                            records: action.payload.map((record) => record.id),
                        }).then(() =>
                            dispatch({
                                type: ActionType.DELETED,
                                payload: action.payload.map(
                                    (record) => record.id,
                                ),
                            }),
                        ),
                        {
                            pending: `Deleting ${display}`,
                            success: `Successfully deleted ${display}`,
                            error: `Couldn't delete ${display}`,
                        },
                    );

                    break;
                }

                case ActionType.PIN: {
                    await invoke("pin", { record: action.payload.id });
                    dispatch({
                        type: ActionType.PINNED,
                        payload: action.payload,
                    });
                    toast.success(`Pinned ${action.payload.name}`);

                    break;
                }

                case ActionType.UNPIN: {
                    await invoke("unpin", { record: action.payload });
                    dispatch({
                        type: ActionType.UNPINNED,
                        payload: action.payload,
                    });
                    toast.success("Removed pin");

                    break;
                }

                case ActionType.CREATE: {
                    await toast.promise(
                        invoke<Record>("create", {
                            ...action.payload,
                        }).then((record) =>
                            dispatch({
                                type: ActionType.CREATED,
                                payload: record,
                            }),
                        ),
                        {
                            pending: `Creating ${
                                action.payload.file ? "file" : "directory"
                            } "${action.payload.name}"`,
                            success: `Created ${
                                action.payload.file ? "file" : "directory"
                            } "${action.payload.name}"`,
                            error: `Couldn't ${
                                action.payload.file ? "file" : "directory"
                            } "${action.payload.name}"`,
                        },
                    );

                    break;
                }

                case ActionType.IMPORT: {
                    const imported = await open({
                        multiple: true,
                        title: "Import Files",
                    });

                    if (imported !== null) {
                        const files = Array.isArray(imported)
                            ? imported
                            : [imported];

                        await toast.promise(
                            invoke<Record[]>("import", {
                                files,
                            }).then((records) =>
                                dispatch({
                                    type: ActionType.IMPORTED,
                                    payload: records,
                                }),
                            ),
                            {
                                pending: `Importing ${files.length} ${
                                    files.length > 1 ? "files" : "file"
                                }`,
                                success: `Imported ${files.length} ${
                                    files.length > 1 ? "files" : "file"
                                }`,
                                error: `Couldn't import ${files.length} ${
                                    files.length > 1 ? "files" : "file"
                                }`,
                            },
                        );
                    }

                    break;
                }

                case ActionType.EXPORT: {
                    const file = await save({ title: "Save file" });

                    if (file !== null) {
                        await toast.promise(
                            invoke("export", {
                                record: action.payload.id,
                                file,
                            }),
                            {
                                pending: `Exporting "${action.payload.name}"`,
                                success: `Exported "${action.payload.name}"`,
                                error: `Couldn't export "${action.payload.name}"`,
                            },
                        );
                    }

                    break;
                }

                case ActionType.DROP: {
                    const files = action.payload;

                    await toast.promise(
                        invoke<Record[]>("import", {
                            files,
                        }).then((records) =>
                            dispatch({
                                type: ActionType.DROPPED,
                                payload: records,
                            }),
                        ),
                        {
                            pending: `Importing ${files.length} ${
                                files.length > 1 ? "files" : "file"
                            }`,
                            success: `Imported ${files.length} ${
                                files.length > 1 ? "files" : "file"
                            }`,
                            error: `Couldn't import ${files.length} ${
                                files.length > 1 ? "files" : "file"
                            }`,
                        },
                    );

                    break;
                }

                case ActionType.RENAME: {
                    await invoke("rename", { ...action.payload });
                    dispatch({
                        type: ActionType.RENAMED,
                        payload: action.payload,
                    });
                    toast.success("Renamed file");
                    break;
                }

                case ActionType.CHANGE_DIRECTORY: {
                    const records = await invoke<[Record, Record[]]>(
                        "request",
                        {
                            record: action.payload.id,
                        },
                    );
                    dispatch({
                        type: ActionType.CHANGED_DIRECTORY,
                        payload: {
                            returned: records,
                            path: action.payload.path,
                        },
                    });
                    break;
                }

                default:
                    dispatch(action);
                    break;
            }
        },
        [dispatch],
    );
