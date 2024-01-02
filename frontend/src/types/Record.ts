import type { DirectoryRecord } from "./DirectoryRecord";
import type { FileRecord } from "./FileRecord";
import { SymlinkRecord } from "./SymlinkRecord";

export type Record =
    | { kind: "File"; content: FileRecord }
    | { kind: "Directory"; content: DirectoryRecord }
    | { kind: "Symlink"; content: SymlinkRecord };
