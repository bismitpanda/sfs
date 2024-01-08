import { Record } from "./Record";

export interface AppState {
    records: Record[];
    workingDir: { name: string; id: number }[];
    pinned: Record[];
    currDirRecord: Record;
}
