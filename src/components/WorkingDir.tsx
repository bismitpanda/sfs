import { Home } from "lucide-react";

export const WorkingDir: React.FC<{ path: string[] }> = ({ path }) => (
    <div className="breadcrumbs text-sm min-h-5">
        <ul>
            <li>
                <a>
                    <Home strokeWidth={1} size={15} />
                </a>
            </li>
            {path.map((segment, idx) => (
                <li key={idx}>
                    <a>{segment}</a>
                </li>
            ))}
        </ul>
    </div>
);
