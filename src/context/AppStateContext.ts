import { Action } from "@type/Action";
import { AppState } from "@type/AppState";
import { Dispatch, createContext } from "react";

export const AppStateContext = createContext<{
    appState: AppState;
    dispatch: Dispatch<Action>;
}>({
    appState: {
        records: [],
        workingDir: [],
        pinned: [],
        currDirRecord: {
            name: "",
            id: 0,
            file_times: {
                accessed: {
                    year: 0,
                    month: 0,
                    day: 0,
                    minute: 0,
                    hour: 0,
                    second: 0,
                },
                modified: {
                    year: 0,
                    month: 0,
                    day: 0,
                    minute: 0,
                    hour: 0,
                    second: 0,
                },
                created: {
                    year: 0,
                    month: 0,
                    day: 0,
                    minute: 0,
                    hour: 0,
                    second: 0,
                },
            },
            inner: {
                tag: "Directory",
                entries: {},
            },
        },
    },
    dispatch: (_) => {},
});
