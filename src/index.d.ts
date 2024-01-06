type Record = import("./types").Record;

type DeleteInvokeType = (
    cmd: "delete",
    args: { records: number[] },
) => Promise<void>;

type PinInvokeType = (
    cmd: "pin" | "unpin",
    args: { record: number },
) => Promise<void>;

type CreateInvokeType = (
    cmd: "create_file" | "create_directory",
    args: { name: string },
) => Promise<Record>;

type ImportInvokeType = (
    cmd: "import",
    args: { files: string[] },
) => Promise<Record[]>;

type ExportInvokeType = (
    cmd: "export",
    args: { record: number; file: string },
) => Promise<void>;

type LoginInvokeType = (
    cmd: "login",
    args: { password: string },
) => Promise<void>;

type InitInvokeType = (
    cmd: "initialize",
) => Promise<{ currDirRecord: Record; records: Record[]; pinned: Record[] }>;

type InvokeType = DeleteInvokeType &
    PinInvokeType &
    CreateInvokeType &
    ImportInvokeType &
    ExportInvokeType &
    LoginInvokeType &
    InitInvokeType;

declare module "@tauri-apps/api" {
    const invoke: InvokeType;
}
