import { FileTime } from ".";

export interface FileTimes {
    accessed: FileTime;
    modified: FileTime;
    created: FileTime;
}
