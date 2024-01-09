import type { DirectoryRecord } from "./DirectoryRecord";
import type { FileRecord } from "./FileRecord";
import { SymlinkRecord } from "./SymlinkRecord";

type FileRecordType = { tag: "File" } & FileRecord;
type DirectoryRecordType = { tag: "Directory" } & DirectoryRecord;
type SymlinkRecordType = { tag: "Symlink" } & SymlinkRecord;

export type RecordInner =
    | FileRecordType
    | DirectoryRecordType
    | SymlinkRecordType;
