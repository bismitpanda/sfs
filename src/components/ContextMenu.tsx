import { MenuItemType } from "@type/MenuItemType";
import { MouseEvent, useRef } from "react";

export const ContextMenu: React.FC<{
    open: boolean;
    ev?: MouseEvent;
    items: MenuItemType[];
    closeMenu: () => void;
}> = ({ open, ev, items, closeMenu }) => {
    const contextMenuRef = useRef<HTMLDivElement>(null);

    if (!ev) {
        return <></>;
    }

    const { clientX, clientY, pageY, pageX } = ev;
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
        <>
            {open && (
                <div
                    id="ctxmenu"
                    ref={contextMenuRef}
                    className={`absolute bg-[#262626] p-1 rounded-lg ${
                        open ? "flex flex-col gap-1" : "hidden"
                    } z-50`}
                    style={{ top: `${y}px`, left: `${x}px` }}
                >
                    {items.map(({ label, icon: Icon, onClick }, i) => (
                        <button
                            className="hover:bg-[#333] py-2 pl-5 pr-10 rounded-md active:scale-95 transition"
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
            )}
        </>
    );
};
