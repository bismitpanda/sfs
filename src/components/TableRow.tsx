import { useSelectedContext } from "@hooks/useSelectedContext";
import { FileTime } from "@type/FileTime";
import { Record } from "@type/Record";
import { LucideIcon } from "lucide-react";
import { DateTime } from "luxon";

export const TableRow: React.FC<{
    record: Record;
    date: FileTime;
    size: string;
    icon: LucideIcon;
    editing: boolean;
    onInput: (value: string) => void;
}> = ({ record, date, size, icon: Icon, editing, onInput }) => {
    const { selected } = useSelectedContext();

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
                <span className="h-5 w-5">
                    <Icon size={18} strokeWidth={1} />
                </span>
                <span
                    className="text-ellipsis mr-2"
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
