import { LucideIcon } from "lucide-react";
import { DateTime } from "luxon";

import { useSelectedContext } from "../context";
import { FileTime, Record } from "../types";

export const TableRow: React.FC<{
    record: Record;
    date: FileTime;
    size: string;
    icon: LucideIcon;
}> = ({ record, date, size, icon: Icon }) => {
    const { selected } = useSelectedContext();

    return (
        <>
            <span className="flex flex-row gap-4">
                <input
                    checked
                    disabled
                    type="checkbox"
                    className={`checkbox checkbox-sm pl-3 transition-opacity duration-200 ${
                        selected.includes(record) ? "opacity-50" : "!opacity-0"
                    }`}
                />
                <Icon size={18} strokeWidth={1} />
                {record.name}
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
