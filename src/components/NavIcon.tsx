import { LucideIcon } from "lucide-react";
import { MouseEventHandler } from "react";

export const NavIcon: React.FC<{
    icon: LucideIcon;
    color?: string;
    tooltipTop?: string;
    tooltipBot?: string;
    onClick?: MouseEventHandler;
}> = ({ icon: Icon, color, tooltipTop, tooltipBot, onClick }) => (
    <div
        data-tooltip={tooltipTop || tooltipBot}
        className={`navbar-item bg-[#282828] aspect-square p-2 hover:opacity-75 active:opacity-70 active:!scale-[0.97] ${
            tooltipTop ? "tooltip tooltip-top" : ""
        } ${tooltipBot ? "tooltip tooltip-bottom" : ""}`}
        onClick={onClick}
    >
        <Icon size={16} strokeWidth={1} color={color} />
    </div>
);
