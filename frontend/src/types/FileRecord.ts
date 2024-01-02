import type { FileTimes } from "./FileTimes";

export interface FileRecord {
    name: string;
    size: number;
    date_time: FileTimes;
}
