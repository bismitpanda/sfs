import { listen } from "@tauri-apps/api/event";
import { appWindow } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";

export const PhotoViewer: React.FC = () => {
    const [url, setUrl] = useState("");

    useEffect(() => {
        const unlisten = listen<number>("image_load", (ev) => {
            setUrl(`photo://localhost?id=${ev.payload}`);
        });

        appWindow.emit("loaded");

        return () => {
            unlisten.then((f) => f());
        };
    });

    return <img src={url} alt="Image" />;
};
