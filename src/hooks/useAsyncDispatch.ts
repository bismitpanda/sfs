import { invoke } from "@tauri-apps/api";
import { open, save } from "@tauri-apps/api/dialog";
import { Dispatch, useCallback } from "react";

import { Action, ActionType } from "../types";

export const useAsyncDispatch = (dispatch: Dispatch<Action>) =>
    useCallback(
        async (action: Action) => {
            switch (action.type) {
                case ActionType.DELETE: {
                    try {
                        await invoke("delete", {
                            records: action.payload.map((record) => record.id),
                        });
                        dispatch({
                            type: ActionType.DELETED,
                            payload: [
                                `Successfully deleted ${
                                    action.payload.length > 1
                                        ? ` ${action.payload.length} files`
                                        : ` "${action.payload[0]?.name}"`
                                }
                            ?`,
                                action.payload.map((record) => record.id),
                            ],
                        });
                    } catch {
                        dispatch({
                            type: ActionType.DELETED,
                        });
                    }
                    break;
                }

                case ActionType.PIN: {
                    await invoke("pin", { record: action.payload.id });
                    dispatch({
                        type: ActionType.PINNED,
                        payload: action.payload,
                    });
                    break;
                }

                case ActionType.UNPIN: {
                    await invoke("unpin", { record: action.payload.id });
                    dispatch({
                        type: ActionType.UNPINNED,
                        payload: action.payload.id,
                    });
                    break;
                }

                case ActionType.CREATE_FILE: {
                    const record = await invoke("create_file", {
                        name: action.payload,
                    });

                    dispatch({
                        type: ActionType.CREATED_FILE,
                        payload: record,
                    });
                    break;
                }

                case ActionType.CREATE_DIRECTORY: {
                    const record = await invoke("create_directory", {
                        name: action.payload,
                    });
                    dispatch({
                        type: ActionType.CREATED_DIRECTORY,
                        payload: record,
                    });
                    break;
                }

                case ActionType.IMPORT: {
                    const imported = await open({
                        multiple: true,
                        title: "Import Files",
                    });

                    if (imported !== null) {
                        const records = await invoke("import", {
                            files: Array.isArray(imported)
                                ? imported
                                : [imported],
                        });

                        dispatch({
                            type: ActionType.IMPORTED,
                            payload: records,
                        });
                    }

                    break;
                }

                case ActionType.EXPORT: {
                    const file = await save({ title: "Save file" });

                    if (file !== null) {
                        await invoke("export", {
                            record: action.payload.id,
                            file,
                        });

                        dispatch({
                            type: ActionType.EXPORTED,
                            payload: `Successfully exported ${action.payload.name}`,
                        });
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
