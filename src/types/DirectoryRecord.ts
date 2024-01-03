import type { FileTimes } from "./FileTimes";

export interface DirectoryRecord {
    id: number;
    name: string;
    date_time: FileTimes;
    entries: Record<string, number>;
}
