import { useContext } from "react";

import { SelectedContext } from "../contexts";
import { humanTime } from "../utils";

export const TableRecord: React.FC<{
    idx: number;
    name: string;
    date: number;
    size: string;
    icon: React.ReactNode;
}> = ({ idx, name, date, size, icon }) => {
    const { selected } = useContext(SelectedContext);

    return (
        <>
            <span className="flex flex-row gap-4">
                <input
                    checked
                    disabled
                    type="checkbox"
                    className={`checkbox checkbox-sm pl-2 ${
                        selected === idx ? "visible" : "invisible"
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
