import { appWindow } from "@tauri-apps/api/window";
import { Maximize, Minimize, Minus, X } from "lucide-react";

export const TitleBar: React.FC<{ isMaximized: boolean }> = ({
    isMaximized,
}) => (
    <div
        data-tauri-drag-region
        className="h-8 select-none flex justify-end fixed top-0 left-0 right-0 bg-dark-300"
    >
        <div
            className="inline-flex justify-center items-center w-8 h-8 hover:bg-dark-500"
            onClick={() => appWindow.minimize()}
        >
            <Minus size={16} />
        </div>
        <div
            className="inline-flex justify-center items-center w-8 h-8 hover:bg-dark-500"
            onClick={() => appWindow.toggleMaximize()}
        >
            {isMaximized ? <Minimize size={16} /> : <Maximize size={16} />}
        </div>
        <div
            className="inline-flex justify-center items-center w-8 h-8 hover:bg-red1"
            onClick={() => appWindow.close()}
        >
            <X size={16} />
        </div>
    </div>
);
