import { useSelectedContext } from "../context";
import { humanTime } from "../utils";

export const TableRecord: React.FC<{
    idx: number;
    name: string;
    date: number;
    size: string;
    icon: React.ReactNode;
}> = ({ idx, name, date, size, icon }) => {
    const { selected } = useSelectedContext();

    return (
        <>
            <span className="flex flex-row gap-4">
                <input
                    checked
                    disabled
                    type="checkbox"
                    className={`checkbox checkbox-sm pl-3 transition-opacity duration-300 ${
                        selected.includes(idx) ? "opacity-50" : "!opacity-0"
                    }`}
                />
                {icon}
                {name}
            </span>
            <span>{size}</span>
            <span>{humanTime(date)}</span>
        </>
    );
};
