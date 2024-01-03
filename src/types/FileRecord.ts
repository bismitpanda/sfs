import type { FileTimes } from "./FileTimes";

export interface FileRecord {
    id: number;
    name: string;
    size: number;
    date_time: FileTimes;
}
