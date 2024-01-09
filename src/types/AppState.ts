import { PathSegment } from "./PathSegment";
import { Record } from "./Record";

export interface AppState {
    selected: Record[];
    records: Record[];
    workingDir: PathSegment[];
    pinned: Record[];
    workingDirRecord: Record;
}
