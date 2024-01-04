import { Record } from "./Record";

export interface AppState {
    records: Record[];
    workingDir: string[];
    pinned: Record[];
    currDirRecord: Record;
}
