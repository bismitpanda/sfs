import { ArrowDownUp, FileSymlink, Folder, FolderSymlink } from "lucide-react";

import { useAppStateContext, useSelectedContext } from "../context";
import { Record } from "../types";
import { getIcon, humanFileSize } from "../utils";
import { TableRow } from "./TableRow";

export const FileTable: React.FC = () => {
    const { selected, setSelected } = useSelectedContext();
    const {
        appState: { records },
    } = useAppStateContext();

    const recordsLen = records.length;

    const getRow = (record: Record, idx: number) => {
        switch (record.kind) {
            case "FILE":
                return (
                    <TableRow
                        idx={idx}
                        name={record.name}
                        date={Date.parse(record.date)}
                        size={humanFileSize(record.size)}
                        icon={getIcon(record.name)}
                    />
                );

            case "FOLDER":
                return (
                    <TableRow
                        idx={idx}
                        name={record.name}
                        date={Date.parse(record.date)}
                        size="-"
                        icon={<Folder size={18} strokeWidth={1} />}
                    />
                );

            case "SYMLINK_FILE":
                return (
                    <TableRow
                        idx={idx}
                        name={record.name}
                        date={Date.parse(record.date)}
                        size="-"
                        icon={<FileSymlink size={18} strokeWidth={1} />}
                    />
                );

            case "SYMLINK_FOLDER":
                return (
                    <TableRow
                        idx={idx}
                        name={record.name}
                        date={Date.parse(record.date)}
                        size="-"
                        icon={<FolderSymlink size={18} strokeWidth={1} />}
                    />
                );
        }
    };

    return (
        <div className="grid grid-row-2 w-full max-h-[calc(100%-104px)] bg-[#1a1a1a] rounded-lg text-sm text-[#aaa]">
            <div className="grid grid-cols-[50%_15%_auto] py-3 bg-inherit border-b-[3px] border-b-[#111] rounded-t-md">
                <div className="flex flex-row gap-1 pl-3">
                    <input
                        checked={selected.length === recordsLen}
                        type="checkbox"
                        className={`checkbox checkbox-sm pl-3 mr-11 transition-opacity duration-200 ${
                            selected.length > 0 ? "opacity-100" : "!opacity-0"
                        }`}
                        disabled={!(selected.length > 0)}
                        onChange={() => {
                            setSelected(
                                selected.length < recordsLen
                                    ? Array.from(
                                          { length: recordsLen },
                                          (_, index) => index,
                                      )
                                    : [],
                            );
                        }}
                    />
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
            <div className="overflow-y-auto grid grid-cols-[51%_15%_auto]">
                {recordsLen > 0 &&
                    records.map((record, idx) => {
                        return (
                            <div
                                key={idx}
                                className={`
                                    ${
                                        selected.includes(idx)
                                            ? "bg-[#282828] after:bottom-0"
                                            : "after:-bottom-[1px]"
                                    } grid grid-cols-subgrid col-span-4 cursor-pointer pl-3 pr-10 py-4 relative hover:bg-[#282828] active:bg-[#222222] after:content-[''] after:absolute after:w-[calc(100%-60px)] last:after:h-0 after:h-[1px] hover:after:bottom-0 after:bg-[#282828] after:left-[30px] transition-colors duration-200`}
                                onClick={() =>
                                    selected.includes(idx)
                                        ? setSelected((selected) =>
                                              selected.filter(
                                                  (num) => num !== idx,
                                              ),
                                          )
                                        : setSelected((selected) => [
                                              ...selected,
                                              idx,
                                          ])
                                }
                                onDoubleClick={() => console.log(record.name)}
                            >
                                {getRow(record, idx)}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};
