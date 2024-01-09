import { FileTime } from "@type/FileTime";
import { DateTime } from "luxon";

export const getTimeString = (dt: FileTime) => {
    return DateTime.fromObject(dt, { zone: "utc" })
        .setZone("local")
        .toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
};
