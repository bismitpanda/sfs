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
        case ActionType.CREATE_FILE:
        case ActionType.CREATE_DIRECTORY:
        case ActionType.IMPORT:
        case ActionType.EXPORT:
        case ActionType.DROP:
        case ActionType.RENAME:
        case ActionType.REQUEST_RECORDS: {
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

        case ActionType.CREATED_FILE:
        case ActionType.CREATED_DIRECTORY: {
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

        case ActionType.HANDLE_RESPONSE: {
            const [currDirRecord, records] = action.payload;
            const workingDir = [
                ...state.workingDir,
                { name: currDirRecord.name, id: currDirRecord.id },
            ];
            return { ...state, currDirRecord, records, workingDir };
        }

        default:
            console.warn("Unknown dispatch action: ", action);
            return state;
    }
};
