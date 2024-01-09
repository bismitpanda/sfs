import { LucideIcon } from "lucide-react";

export interface MenuItemType {
    icon: LucideIcon;
    label: string;
    onClick: () => void | Promise<void>;
}
