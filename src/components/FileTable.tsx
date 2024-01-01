import { getIcon } from "../utils/mapExtIcon";
import "./FileTable.css";
import { Folder, ArrowDownUp } from "lucide-react";

export type Record =
    | { kind: "FILE"; name: string; size: number }
    | { kind: "FOLDER"; name: string };

export const FileTable: React.FC<{ records?: Record[] }> = ({ records }) => (
    <div className="grid grid-row-2 w-full max-h-[calc(100%-104px)] bg-[#1a1a1a] rounded-lg text-sm text-[#aaa]">
        <div className="grid grid-cols-[40%_10%_auto] py-3 bg-inherit border-b-[3px] border-b-[#111] rounded-t-md">
            <div className="flex flex-row gap-1 pl-[72px]">
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
        <div className="overflow-y-auto grid grid-cols-[41%_10%_auto]">
            {records &&
                records.map((record, idx) => {
                    return (
                        <div
                            key={idx}
                            className="grid grid-cols-subgrid col-span-4 px-10 py-4 relative hover:bg-[#282828] after:content-[''] after:absolute after:w-[calc(100%-60px)] last:after:h-0 after:h-[1px] hover:after:bottom-0 after:-bottom-[1px] after:bg-[#282828] after:left-[30px] transition-colors duration-[175ms]"
                        >
                            {record.kind === "FILE" ? (
                                <>
                                    <span className="flex flex-row gap-4">
                                        {getIcon(record.name)}
                                        {record.name}
                                    </span>
                                    <span>{record.size} K</span>
                                    <span>Yesterday</span>
                                </>
                            ) : (
                                <>
                                    <span className="flex flex-row gap-4">
                                        <Folder size={18} strokeWidth={1} />
                                        {record.name}
                                    </span>
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
