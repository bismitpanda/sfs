import { invoke } from "@tauri-apps/api";
import { isEqual } from "radash";

import { Action, ActionType, AppState } from "../types";

export const appStateReducer = (state: AppState, action: Action) => {
    switch (action.type) {
        case ActionType.DELETE: {
            invoke("delete", { records: action.payload });
            return {
                ...state,
                records: state.records.filter(
                    (record) => !action.payload.includes(record),
                ),
            };
        }

        case ActionType.PIN: {
            invoke("pin", { record: action.payload });
            return {
                ...state,
                pinned: [...state.pinned, action.payload],
            };
        }

        case ActionType.UNPIN: {
            invoke("unpin", { record: action.payload });
            return {
                ...state,
                pinned: state.pinned.filter(
                    (pinned) => !isEqual(pinned, action.payload),
                ),
            };
        }

        case ActionType.CREATED_FILE:
        case ActionType.CREATED_DIRECTORY:
            return { ...state, records: [...state.records, action.payload] };

        default:
            console.warn("Unknown dispatch action", action);
            return state;
    }
};
