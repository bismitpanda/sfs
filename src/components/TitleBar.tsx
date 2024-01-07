import { appWindow } from "@tauri-apps/api/window";
import { Maximize, Minimize, Minus, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export const TitleBar: React.FC = () => {
    const [isMaximized, setIsMaximized] = useState(false);

    const updateIsMaximized = useCallback(async () => {
        const maximized = await appWindow.isMaximized();
        setIsMaximized(maximized);
    }, []);

    useEffect(() => {
        updateIsMaximized();

        const unlisten = appWindow.onResized(() => {
            updateIsMaximized();
        });

        return () => {
            unlisten.then((f) => f());
        };
    }, [updateIsMaximized]);

    return (
        <div
            data-tauri-drag-region
            className="h-8 select-none flex justify-end fixed top-0 left-0 right-0 bg-[#1d1d1d]"
        >
            <div
                className="inline-flex justify-center items-center w-8 h-8 hover:bg-[#272727]"
                onClick={() => appWindow.minimize()}
            >
                <Minus size={16} />
            </div>
            <div
                className="inline-flex justify-center items-center w-8 h-8 hover:bg-[#272727]"
                onClick={() => appWindow.toggleMaximize()}
            >
                {isMaximized ? <Minimize size={16} /> : <Maximize size={16} />}
            </div>
            <div
                className="inline-flex justify-center items-center w-8 h-8 hover:bg-[#ff5e5e]"
                onClick={() => appWindow.close()}
            >
                <X size={16} />
            </div>
        </div>
    );
};
