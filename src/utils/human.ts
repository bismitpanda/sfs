export const fileSize = (bytes: number, dp = 1) => {
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

export const time = (dt: number) => {
    let seconds = Math.round((Date.now() - dt) / 1000);

    const suffix = seconds < 0 ? "from now" : "ago";
    seconds = Math.abs(seconds);

    const times = [
        seconds / 60 / 60 / 24 / 365,
        seconds / 60 / 60 / 24 / 30,
        seconds / 60 / 60 / 24 / 7,
        seconds / 60 / 60 / 24,
        seconds / 60 / 60,
        seconds / 60,
        seconds,
    ];

    const names = ["year", "month", "week", "day", "hour", "minute", "second"];

    for (let i = 0; i < names.length; i++) {
        const time = Math.floor(times[i]);
        let name = names[i];
        if (time > 1) name += "s";

        if (time >= 1) return time + " " + name + " " + suffix;
    }
    return "0 seconds " + suffix;
};
