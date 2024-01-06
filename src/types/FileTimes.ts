import { FileTime } from "./FileTime";

export interface FileTimes {
    accessed: FileTime;
    modified: FileTime;
    created: FileTime;
}
