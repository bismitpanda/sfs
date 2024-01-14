import { useAppStateContext } from "@hooks/useAppStateContext";
import { appWindow } from "@tauri-apps/api/window";
import { ActionType } from "@type/ActionType";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

export const DropZone: React.FC = () => {
    const { dispatch } = useAppStateContext();
    const [filesHover, setFilesHover] = useState(false);

    useEffect(() => {
        const unlisten = appWindow.onFileDropEvent((event) => {
            switch (event.payload.type) {
                case "drop":
                    setFilesHover(false);
                    dispatch({
                        type: ActionType.DROP,
                        payload: event.payload.paths,
                    });
                    break;

                case "hover":
                    setFilesHover(true);
                    break;

                case "cancel":
                    setFilesHover(false);
                    break;
            }
        });

        return () => {
            unlisten.then((f) => f());
        };
    }, [dispatch]);

    return (
        <div
            className={`flex flex-col items-center justify-center align-middle absolute w-3/4 rounded-xl border-opacity-100 border-4 border-dashed border-sky-400 h-[calc(100%-172px)] right-5 bottom-4 bg-white transition-opacity duration-500 pointer-events-none ${
                filesHover
                    ? "opacity-100 bg-opacity-20"
                    : "opacity-0 bg-opacity-0"
            }`}
        >
            <div className="size-20">
                <Plus size={100} />
            </div>
        </div>
    );
};
