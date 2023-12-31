import {
    ClipboardCopy,
    Download,
    FilePlus,
    FolderPlus,
    FolderSearch2,
    FolderUp,
    Info,
    Pencil,
    SendHorizonal,
    Trash2,
    Upload,
} from "lucide-react";

export const Navbar: React.FC<{ selected?: boolean }> = ({ selected }) => (
    <div className="navbar bg-[#222] shadow-none rounded-lg">
        <div className="navbar-start gap-3">
            <div className="navbar-item bg-[#333] aspect-square p-2 hover:opacity-75 active:opacity-70 active:!scale-[0.97]">
                <FolderUp color="#ffaa5c" size={16} strokeWidth={1} />
            </div>
            <div className="navbar-item bg-[#333] aspect-square p-2 hover:opacity-75 active:opacity-70 active:!scale-[0.97]">
                <FolderSearch2 color="#8fd0ff" size={16} strokeWidth={1} />
            </div>
            <div className="navbar-item bg-[#333] aspect-square p-2 hover:opacity-75 active:opacity-70 active:!scale-[0.97]">
                <FolderPlus color="#7dff9a" size={16} strokeWidth={1} />
            </div>
            <div className="navbar-item bg-[#333] aspect-square p-2 hover:opacity-75 active:opacity-70 active:!scale-[0.97]">
                <FilePlus color="#7dff9a" size={16} strokeWidth={1} />
            </div>
        </div>
        <div className="navbar-end gap-3">
            {selected && (
                <>
                    <div className="navbar-item bg-[#333] aspect-square p-2 hover:opacity-75 active:opacity-70 active:!scale-[0.97]">
                        <SendHorizonal
                            color="#ff7979"
                            size={16}
                            strokeWidth={1}
                        />
                    </div>
                    <div className="navbar-item bg-[#333] aspect-square p-2 hover:opacity-75 active:opacity-70 active:!scale-[0.97]">
                        <Pencil color="#ff7979" size={16} strokeWidth={1} />
                    </div>
                    <div className="navbar-item bg-[#333] aspect-square p-2 hover:opacity-75 active:opacity-70 active:!scale-[0.97]">
                        <Trash2 color="#ff7979" size={16} strokeWidth={1} />
                    </div>
                    <div className="navbar-item bg-[#333] aspect-square p-2 hover:opacity-75 active:opacity-70 active:!scale-[0.97]">
                        <ClipboardCopy
                            color="#8fd0ff"
                            size={16}
                            strokeWidth={1}
                        />
                    </div>
                </>
            )}
            <div className="navbar-item bg-[#333] aspect-square p-2 hover:opacity-75 active:opacity-70 active:!scale-[0.97]">
                <Info color="#8fd0ff" size={16} strokeWidth={1} />
            </div>
            <div className="navbar-item bg-[#333] aspect-square p-2 hover:opacity-75 active:opacity-70 active:!scale-[0.97]">
                <Upload color="#7dff9a" size={16} strokeWidth={1} />
            </div>
            <div className="navbar-item bg-[#333] aspect-square p-2 hover:opacity-75 active:opacity-70 active:!scale-[0.97]">
                <Download color="#7dff9a" size={16} strokeWidth={1} />
            </div>
        </div>
    </div>
);
