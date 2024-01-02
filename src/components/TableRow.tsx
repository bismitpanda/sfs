import { useSelectedContext } from "../context";
import { Record } from "../types";
import { humanTime } from "../utils";

export const TableRow: React.FC<{
    record: Record;
    date: number;
    size: string;
    icon: React.ReactNode;
}> = ({ record, date, size, icon }) => {
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
                {icon}
                {record.content.name}
            </span>
            <span>{size}</span>
            <span>{humanTime(date)}</span>
        </>
    );
};
