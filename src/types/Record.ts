import { FileTimes } from "./FileTimes";
import { RecordInner } from "./RecordInner";

export interface Record {
    id: number;
    name: string;
    file_times: FileTimes;
    inner: RecordInner;
}
