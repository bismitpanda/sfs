import { useAppStateContext } from "@hooks/useAppStateContext";
import { Home } from "lucide-react";

export const WorkingDir: React.FC = () => {
    const { appState } = useAppStateContext();

    return (
        <div className="breadcrumbs text-sm min-h-5">
            <ul>
                <li>
                    <span className="hover:bg-dark-300 transition-colors p-1 rounded-md">
                        <Home strokeWidth={1} size={16} />
                    </span>
                </li>
                {appState.workingDir.map(({ id, name }) => (
                    <li key={id}>
                        <span className="hover:underline">{name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
