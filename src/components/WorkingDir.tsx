import { useAppStateContext } from "@hooks/useAppStateContext";
import { Home } from "lucide-react";

export const WorkingDir: React.FC = () => {
    const {
        appState: { workingDir },
    } = useAppStateContext();

    return (
        <div className="breadcrumbs text-sm min-h-5">
            <ul>
                <li>
                    <span className="hover:bg-dark-300 transition-colors p-1 rounded-md">
                        <Home strokeWidth={1} size={16} />
                    </span>
                </li>
                {workingDir.map((segment, idx) => (
                    <li key={idx}>
                        <span className="hover:underline">{segment}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
