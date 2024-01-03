import { FileTimes } from "./FileTimes";

export interface SymlinkRecord {
    id: number;
    name: string;
    date_time: FileTimes;
    reference_record_id: number;
    is_file: boolean;
}
