import { Dispatch, createContext } from "react";

import { Record } from "../components/FileTable";

interface State {
    records: Record[];
    workingDir: string[];
    pinned: Record[];
}

export enum ActionType {
    DELETE,
}

interface Action {
    type: ActionType;
    payload?: {
        [key: string]: string;
    };
}

export const AppStateContext = createContext<{
    appState: State;
    dispatch: Dispatch<Action>;
}>({
    appState: {
        records: [],
        workingDir: [],
        pinned: [],
    },
    dispatch: (value) => console.log(value),
});

export const appStateReducer = (state: State, action: Action) => {
    switch (action.type) {
        default:
            return state;
    }
};
export type { State as AppState };
