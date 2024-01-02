import type { Record } from "./Record";

export interface Meta {
    entries: Array<Record>;
    free_fragments: Array<[number, Array<number>]>;
    empty_records: Array<number>;
    end_offset: number;
    pinned: Array<number>;
}
