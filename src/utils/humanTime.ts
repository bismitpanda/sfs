export const humanTime = (dt: number) => {
    let seconds = Math.round((Date.now() - dt) / 1000);

    const suffix = seconds < 0 ? "from now" : "ago";
    seconds = Math.abs(seconds);

    const times = [
        seconds / 31536000,
        seconds / 2592000,
        seconds / 604800,
        seconds / 86400,
        seconds / 3600,
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
