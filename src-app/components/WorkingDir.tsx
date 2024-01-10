import { useAppStateContext } from "@hooks/useAppStateContext";
import { ActionType } from "@type/ActionType";
import { Home } from "lucide-react";

export const WorkingDir: React.FC = () => {
    const { appState, dispatch } = useAppStateContext();

    return (
        <div className="breadcrumbs text-sm min-h-5">
            <ul>
                <li
                    onClick={() => {
                        dispatch({
                            type: ActionType.CHANGE_DIRECTORY,
                            payload: { id: 0, path: [] },
                        });
                    }}
                >
                    <span className="hover:bg-dark-200 transition-colors p-1 rounded-md">
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
