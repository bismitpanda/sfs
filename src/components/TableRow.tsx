import { useSelectedContext } from "@hooks/useSelectedContext";
import { FileTime } from "@type/FileTime";
import { Record } from "@type/Record";
import { LucideIcon } from "lucide-react";
import { DateTime } from "luxon";
import { useEffect, useRef } from "react";

export const TableRow: React.FC<{
    record: Record;
    date: FileTime;
    size: string;
    icon: LucideIcon;
    editing: boolean;
    onInput: (value: string) => void;
}> = ({ record, date, size, icon: Icon, editing, onInput }) => {
    const { selected } = useSelectedContext();
    const spanRef = useRef<HTMLSpanElement>(null);

    const replaceCaret = (el: HTMLElement | null) => {
        if (!el) return;

        const target = document.createTextNode("");
        el.appendChild(target);

        const isTargetFocused = document.activeElement === el;
        if (target !== null && target.nodeValue !== null && isTargetFocused) {
            const sel = window.getSelection();
            if (sel !== null) {
                const range = document.createRange();
                range.setStart(target, target.nodeValue.length);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }

            if (el instanceof HTMLElement) el.focus();
        }
    };

    useEffect(() => {
        spanRef.current?.focus();
        replaceCaret(spanRef.current);
    }, []);

    return (
        <>
            <span className="flex flex-row gap-4">
                <input
                    checked
                    disabled
                    type="checkbox"
                    className={`checkbox checkbox-sm pl-3 transition-opacity duration-200 ${
                        selected.some((obj) => obj.id === record.id)
                            ? "opacity-50"
                            : "!opacity-0"
                    }`}
                />
                <Icon size={18} strokeWidth={1} />
                <span
                    ref={spanRef}
                    contentEditable={editing}
                    suppressContentEditableWarning
                    onInput={(ev) =>
                        onInput(ev.currentTarget.textContent || "")
                    }
                >
                    {record.name}
                </span>
            </span>
            <span>{size}</span>
            <span>
                {DateTime.fromObject(date, { zone: "utc" })
                    .setZone("local")
                    .toRelative()}
            </span>
        </>
    );
};
