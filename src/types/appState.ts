import { Record } from "./record";

export interface AppState {
    records: Record[];
    workingDir: string[];
    pinned: Record[];
}

export enum AppActionType {
    DELETE,
}

export interface AppAction {
    type: AppActionType;
    payload?: {
        [key: string]: string;
    };
}
