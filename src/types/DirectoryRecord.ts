import type { FileTimes } from "./FileTimes";

export interface DirectoryRecord {
    name: string;
    date_time: FileTimes;
    entries: Record<string, number>;
}
