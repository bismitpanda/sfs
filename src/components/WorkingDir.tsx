import { useAppStateContext } from "@hooks/useAppStateContext";
import { useSelectedContext } from "@hooks/useSelectedContext";
import { ActionType } from "@type/ActionType";
import { Home } from "lucide-react";

export const WorkingDir: React.FC = () => {
    const { appState, dispatch } = useAppStateContext();
    const { setSelected } = useSelectedContext();

    return (
        <div className="breadcrumbs text-sm min-h-5">
            <ul>
                <li
                    onClick={() => {
                        dispatch({
                            type: ActionType.CHANGE_DIRECTORY,
                            payload: { id: 0, path: [] },
                        });
                        setSelected([]);
                    }}
                >
                    <span className="hover:bg-dark-300 transition-colors p-1 rounded-md">
                        <Home strokeWidth={1} size={16} />
                    </span>
                </li>
                {appState.workingDir.map(({ id, name }, idx) => (
                    <li
                        onClick={() => {
                            dispatch({
                                type: ActionType.CHANGE_DIRECTORY,
                                payload: {
                                    id,
                                    path: appState.workingDir.slice(0, idx + 1),
                                },
                            });
                            setSelected([]);
                        }}
                        key={id}
                    >
                        <span className="hover:underline">{name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
