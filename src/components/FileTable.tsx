import { getIcon } from "../utils/mapExtIcon";
import "./FileTable.css";
import { Folder, ArrowDownUp } from "lucide-react";

export type Record =
    | { kind: "FILE"; name: string; size: number }
    | { kind: "FOLDER"; name: string };

export const FileTable: React.FC<{ records?: Record[] }> = ({ records }) => (
    <div className="grid grid-row-[13%_87%] w-full h-fit max-h-[86%] bg-[#222] rounded-lg text-sm text-[#aaa]">
        <div className="grid grid-cols-[7%_45%_11%_37%] py-3 bg-inherit border-b-[3px] px-5 border-b-[#161616] rounded-t-md">
            <div></div>
            <div className="flex flex-row gap-1">
                Name
                <ArrowDownUp size={14} strokeWidth={1} />
            </div>
            <div className="flex flex-row gap-1">
                Size
                <ArrowDownUp size={14} strokeWidth={1} />
            </div>
            <div className="flex flex-row gap-1">
                Last Modified
                <ArrowDownUp size={14} strokeWidth={1} />
            </div>
        </div>
        <div className="overflow-y-auto grid grid-cols-[7%_46%_10%_37%] gap-y-4 pt-3 px-5">
            {records &&
                records.map((record, idx) => {
                    return (
                        <div
                            key={idx}
                            className="grid grid-cols-subgrid col-span-4 last:border-none border-b-2 border-b-[#333] pb-3"
                        >
                            {record.kind === "FILE" ? (
                                <>
                                    {getIcon(record.name)}
                                    <span>{record.name}</span>
                                    <span>{record.size} K</span>
                                    <span>Yesterday</span>
                                </>
                            ) : (
                                <>
                                    <Folder size={18} strokeWidth={1} />
                                    <span>{record.name}</span>
                                    <span>-</span>
                                    <span>Yesterday</span>
                                </>
                            )}
                        </div>
                    );
                })}
        </div>
    </div>
);
