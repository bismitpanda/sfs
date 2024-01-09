import { PathSegment } from "./PathSegment";
import { Record } from "./Record";

export interface AppState {
    records: Record[];
    workingDir: PathSegment[];
    pinned: Record[];
    workingDirRecord: Record;
}
