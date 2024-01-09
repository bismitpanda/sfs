export const humanFileSize = (bytes: number, dp = 1) => {
    const thresh = 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + " B";
    }

    const units = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (
        Math.round(Math.abs(bytes) * r) / r >= thresh &&
        u < units.length - 1
    );

    return bytes.toFixed(dp) + " " + units[u];
};
