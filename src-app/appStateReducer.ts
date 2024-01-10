import { Action } from "@type/Action";
import { ActionType } from "@type/ActionType";
import { AppState } from "@type/AppState";

type AppStateReducer = (state: AppState, action: Action) => AppState;

export const appStateReducer: AppStateReducer = (
    state: AppState,
    action: Action,
) => {
    switch (action.type) {
        case ActionType.DELETE:
        case ActionType.PIN:
        case ActionType.UNPIN:
        case ActionType.CREATE:
        case ActionType.IMPORT:
        case ActionType.EXPORT:
        case ActionType.DROP:
        case ActionType.RENAME:
        case ActionType.CHANGE_DIRECTORY:
        case ActionType.SEND:
        case ActionType.SERVE: {
            console.error(
                "Should have been handle by async dispatcher: ",
                ActionType[action.type],
            );
            return state;
        }

        case ActionType.DELETED: {
            if (action.payload) {
                const ids = action.payload;
                return {
                    ...state,
                    selected: state.selected.filter(
                        (obj) => !ids.includes(obj.id),
                    ),
                    records: state.records.filter(
                        (record) => !ids.some((id) => record.id === id),
                    ),
                    pinned: state.pinned.filter(
                        (record) => !ids.some((id) => record.id === id),
                    ),
                };
            } else {
                return state;
            }
        }

        case ActionType.PINNED: {
            return {
                ...state,
                pinned: [...state.pinned, action.payload],
            };
        }

        case ActionType.UNPINNED: {
            return {
                ...state,
                pinned: state.pinned.filter(
                    (pinned) => pinned.id !== action.payload,
                ),
            };
        }

        case ActionType.CREATED: {
            return { ...state, records: [...state.records, action.payload] };
        }

        case ActionType.IMPORTED:
        case ActionType.DROPPED: {
            return { ...state, records: [...state.records, ...action.payload] };
        }

        case ActionType.RENAMED: {
            return {
                ...state,
                pinned: state.pinned.map((record) =>
                    record.name === action.payload.oldName
                        ? { ...record, name: action.payload.newName }
                        : record,
                ),
                records: state.records.map((record) =>
                    record.name === action.payload.oldName
                        ? { ...record, name: action.payload.newName }
                        : record,
                ),
            };
        }

        case ActionType.CHANGED_DIRECTORY: {
            const [workingDirRecord, records] = action.payload.returned;
            return {
                ...state,
                selected: [],
                workingDirRecord,
                records,
                workingDir: action.payload.path,
            };
        }

        case ActionType.SET_SELECTED: {
            return { ...state, selected: action.payload };
        }

        case ActionType.SERVED: {
            return { ...state, fileServerRunning: !state.fileServerRunning };
        }

        case ActionType.SENT: {
            return {
                ...state,
                records: state.records.filter(
                    (obj) => !action.payload.ids.includes(obj.id),
                ),
            };
        }

        default:
            console.warn("Unknown dispatch action: ", action);
            return state;
    }
};
