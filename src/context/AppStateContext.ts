import { Dispatch, createContext } from "react";

import { Action, AppState } from "../types";

export const AppStateContext = createContext<{
    appState: AppState;
    dispatch: Dispatch<Action>;
}>({
    appState: {
        records: [],
        workingDir: [],
        pinned: [],
    },
    dispatch: (_) => {},
});
