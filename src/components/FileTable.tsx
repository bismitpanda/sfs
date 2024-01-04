import {
    ArrowDownUp,
    FileSymlink,
    Folder,
    FolderGit2,
    FolderSymlink,
} from "lucide-react";
import { isEqual } from "radash";

import { useAppStateContext, useSelectedContext } from "../context";
import { Record } from "../types";
import { getIcon, humanFileSize } from "../utils";
import { TableRow } from "./TableRow";

export const FileTable: React.FC = () => {
    const { selected, setSelected } = useSelectedContext();
    const {
        appState: { records },
    } = useAppStateContext();

    const getRow = (record: Record) => {
        switch (record.inner.tag) {
            case "File":
                return (
                    <TableRow
                        record={record}
                        date={record.fileTimes.modified}
                        size={humanFileSize(record.inner.size)}
                        icon={getIcon(record.name)}
                    />
                );

            case "Directory":
                return (
                    <TableRow
                        record={record}
                        date={record.fileTimes.modified}
                        size="-"
                        icon={record.name === ".git" ? FolderGit2 : Folder}
                    />
                );

            case "Symlink":
                return (
                    <TableRow
                        record={record}
                        date={record.fileTimes.modified}
                        size="-"
                        icon={
                            record.inner.is_file ? FileSymlink : FolderSymlink
                        }
                    />
                );
        }
    };

    return (
        <div className="grid grid-row-2 w-full max-h-[calc(100%-104px)] bg-[#1a1a1a] rounded-lg text-sm text-[#aaa]">
            <div className="grid grid-cols-[50%_15%_auto] py-3 bg-inherit border-b-[3px] border-b-[#111] rounded-t-md">
                <div className="flex flex-row gap-1 pl-3">
                    <input
                        checked={selected.length === records.length}
                        type="checkbox"
                        className={`checkbox checkbox-sm pl-3 mr-11 transition-opacity duration-200 ${
                            selected.length > 0 ? "opacity-100" : "!opacity-0"
                        }`}
                        onChange={() => {
                            if (selected.length > 0) {
                                setSelected(
                                    selected.length < records.length
                                        ? records
                                        : [],
                                );
                            }
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
                {records.length > 0 &&
                    records.map((record, idx) => {
                        return (
                            <div
                                key={idx}
                                className={`
                                    ${
                                        selected.includes(record)
                                            ? "bg-[#282828] after:bottom-0"
                                            : "after:-bottom-[1px]"
                                    } last:hover:rounded-b-md grid grid-cols-subgrid col-span-4 cursor-pointer pl-3 pr-10 py-4 relative hover:bg-[#282828] active:bg-[#222222] after:content-[''] after:absolute after:w-[calc(100%-60px)] last:after:h-0 after:h-[1px] hover:after:bottom-0 after:bg-[#282828] after:left-[30px] transition-all duration-200`}
                                onClick={() =>
                                    selected.includes(record)
                                        ? setSelected((selected) =>
                                              selected.filter(
                                                  (selectedRecord) =>
                                                      !isEqual(
                                                          selectedRecord,
                                                          record,
                                                      ),
                                              ),
                                          )
                                        : setSelected((selected) => [
                                              ...selected,
                                              record,
                                          ])
                                }
                                onDoubleClick={() => console.log(record.name)}
                            >
                                {getRow(record)}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};
