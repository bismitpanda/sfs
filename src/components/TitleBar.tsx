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
            className="h-8 select-none flex justify-end fixed top-0 left-0 right-0 bg-dark-400"
        >
            <div
                className="inline-flex justify-center items-center w-8 h-8 hover:bg-dark-600 transition-colors"
                onClick={() => appWindow.minimize()}
            >
                <Minus size={16} />
            </div>
            <div
                className="inline-flex justify-center items-center w-8 h-8 hover:bg-dark-600 transition-colors"
                onClick={() => appWindow.toggleMaximize()}
            >
                {isMaximized ? <Minimize size={16} /> : <Maximize size={16} />}
            </div>
            <div
                className="inline-flex justify-center items-center w-8 h-8 hover:bg-red1 transition-colors"
                onClick={() => appWindow.close()}
            >
                <X size={16} />
            </div>
        </div>
    );
};
