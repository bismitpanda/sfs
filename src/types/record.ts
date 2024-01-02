export interface Record {
    kind: "FILE" | "FOLDER" | "SYMLINK_FILE" | "SYMLINK_FOLDER";
    name: string;
    size: number;
    date: string;
}
