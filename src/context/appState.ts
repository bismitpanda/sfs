import { Dispatch, createContext } from "react";

import { AppAction, AppState } from "../types";

export const AppStateContext = createContext<{
    appState: AppState;
    dispatch: Dispatch<AppAction>;
}>({
    appState: {
        records: [],
        workingDir: [],
        pinned: [],
    },
    dispatch: (value) => console.log(value),
});

export const appStateReducer = (state: AppState, action: AppAction) => {
    switch (action.type) {
        default:
            return state;
    }
};
