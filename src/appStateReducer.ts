import { Action } from "@type/Action";
import { ActionType } from "@type/ActionType";
import { AppState } from "@type/AppState";

type AppStateReducer = (state: AppState, action: Action) => AppState;

export const appStateReducer: AppStateReducer = (
    state: AppState,
    action: Action,
) => {
    switch (action.type) {
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
        case ActionType.CREATED_DIRECTORY:
            return { ...state, records: [...state.records, action.payload] };

        case ActionType.IMPORTED:
            return { ...state, records: [...state.records, ...action.payload] };

        default:
            console.warn("Unknown dispatch action", action);
            return state;
    }
};
