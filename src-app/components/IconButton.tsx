import { LucideIcon } from "lucide-react";
import { MouseEventHandler } from "react";

export const IconButton: React.FC<{
    icon: LucideIcon;
    color?: string;
    tooltipTop?: string;
    tooltipBot?: string;
    onClick?: MouseEventHandler;
}> = ({ icon: Icon, color, tooltipTop, tooltipBot, onClick }) => (
    <div
        data-tooltip={tooltipTop || tooltipBot}
        className={`navbar-item bg-dark-50 border border-dark-300 aspect-square p-2 hover:bg-dark-100 active:!scale-[0.97] ${
            tooltipTop ? "tooltip tooltip-top" : ""
        } ${tooltipBot ? "tooltip tooltip-bottom" : ""}`}
        onClick={onClick}
    >
        <Icon size={16} strokeWidth={1} color={color} />
    </div>
);
