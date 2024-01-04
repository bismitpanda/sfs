import { FileTimes } from "./FileTimes";
import { RecordInner } from "./RecordInner";

export interface Record {
    id: number;
    name: string;
    path: string[];
    fileTimes: FileTimes;
    inner: RecordInner;
}
