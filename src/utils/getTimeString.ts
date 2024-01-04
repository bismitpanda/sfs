import { DateTime } from "luxon";

import { FileTime } from "../types";

export const getTimeString = (dt: FileTime) => {
    return DateTime.fromObject(dt, { zone: "utc" })
        .setZone("local")
        .toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
};
