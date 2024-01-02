import { FileTimes } from "./FileTimes";

export interface SymlinkRecord {
    name: string;
    date_time: FileTimes;
    reference_record_id: number;
    is_file: boolean;
}
