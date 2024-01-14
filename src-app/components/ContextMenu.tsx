import { MenuItemType } from "@type/MenuItemType";
import { useRef } from "react";

export const ContextMenu: React.FC<{
    open: boolean;
    clientX: number;
    clientY: number;
    pageY: number;
    pageX: number;
    items: MenuItemType[];
    closeMenu: () => void;
}> = ({ open, clientX, clientY, pageY, pageX, items, closeMenu }) => {
    const contextMenuRef = useRef<HTMLDivElement>(null);

    const { innerHeight, innerWidth } = window;
    const [dy, dx] = contextMenuRef.current
        ? [
              contextMenuRef.current.clientHeight,
              contextMenuRef.current.clientWidth,
          ]
        : [211, 160];

    const { x, y } = {
        x: dx + clientX <= innerWidth ? pageX : pageX - dx,
        y: dy + clientY <= innerHeight ? pageY : pageY - dy,
    };

    return (
        <div
            ref={contextMenuRef}
            className={`flex flex-col absolute backdrop-blur-sm bg-opacity-70 bg-dark-100 border border-dark-300 p-1 rounded-lg transition-opacity duration-300 ${
                open ? "opacity-100" : "opacity-0"
            } z-50`}
            style={{ top: `${y}px`, left: `${x}px` }}
        >
            {items.map(({ label, icon: Icon, onClick }, i) => (
                <button
                    className="hover:bg-dark-300 py-2 pl-3 pr-10 rounded-md active:scale-95 transition"
                    key={i}
                    onClick={() => {
                        onClick();
                        closeMenu();
                    }}
                >
                    <span className="flex flex-row gap-4 text-sm">
                        <Icon size={18} strokeWidth={1} /> {label}
                    </span>
                </button>
            ))}
        </div>
    );
};
