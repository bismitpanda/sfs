import { invoke } from "@tauri-apps/api";
import { open, save } from "@tauri-apps/api/dialog";
import { Action } from "@type/Action";
import { ActionType } from "@type/ActionType";
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
                    await toast.promise(
                        invoke("pin", { record: action.payload.id }).then(() =>
                            dispatch({
                                type: ActionType.PINNED,
                                payload: action.payload,
                            }),
                        ),
                        {
                            pending: `Pinning ${action.payload.name}`,
                            error: `Couldn't pin ${action.payload.name}`,
                            success: `Pinned ${action.payload.name}`,
                        },
                    );

                    break;
                }

                case ActionType.UNPIN: {
                    await toast.promise(
                        invoke("unpin", { record: action.payload.id }).then(
                            () =>
                                dispatch({
                                    type: ActionType.UNPINNED,
                                    payload: action.payload.id,
                                }),
                        ),
                        {
                            pending: `Removing pin`,
                            error: `Couldn't unpin ${action.payload.name}`,
                            success: `Removed pin`,
                        },
                    );

                    break;
                }

                case ActionType.CREATE_FILE: {
                    await toast.promise(
                        invoke("create_file", {
                            name: action.payload,
                        }).then((record) =>
                            dispatch({
                                type: ActionType.CREATED_FILE,
                                payload: record,
                            }),
                        ),
                        {
                            pending: `Creating file "${action.payload}"`,
                            success: `Created file "${action.payload}"`,
                            error: `Couldn't create file "${action.payload}"`,
                        },
                    );

                    break;
                }

                case ActionType.CREATE_DIRECTORY: {
                    await toast.promise(
                        invoke("create_directory", {
                            name: action.payload,
                        }).then((record) =>
                            dispatch({
                                type: ActionType.CREATED_DIRECTORY,
                                payload: record,
                            }),
                        ),
                        {
                            pending: `Creating directory "${action.payload}"`,
                            success: `Created directory "${action.payload}"`,
                            error: `Couldn't create directory "${action.payload}"`,
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
                            invoke("import", {
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
                            }).then(() =>
                                dispatch({
                                    type: ActionType.EXPORTED,
                                }),
                            ),
                            {
                                pending: `Exporting "${action.payload.name}"`,
                                success: `Exported "${action.payload.name}"`,
                                error: `Couldn't export "${action.payload.name}"`,
                            },
                        );
                    }

                    break;
                }

                default:
                    dispatch(action);
                    break;
            }
        },
        [dispatch],
    );
