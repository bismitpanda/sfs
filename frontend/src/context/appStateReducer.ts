import { invoke } from "@tauri-apps/api";

import { Action, ActionType, AppState } from "../types";

export const appStateReducer = (state: AppState, action: Action) => {
    switch (action.type) {
        case ActionType.DELETE:
            invoke("delete");
            return {
                ...state,
                records: state.records.filter(
                    (record) => !action.payload.includes(record),
                ),
            };

        case ActionType.PIN:
            invoke("pin", { record: action.payload });
            return {
                ...state,
                pinned: [...state.pinned, action.payload],
            };

        default:
            return state;
    }
};
