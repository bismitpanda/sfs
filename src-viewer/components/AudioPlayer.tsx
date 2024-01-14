import {
    LucideIcon,
    Pause,
    Play,
    Repeat,
    StepBack,
    StepForward,
    Volume,
    Volume1,
    Volume2,
    VolumeX,
} from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";

export const AudioPlayer: React.FC<{ audioSrc: string }> = ({ audioSrc }) => {
    const [volume, setVolume] = useState<{ value: number; muted: boolean }>({
        value: 100,
        muted: false,
    });
    const [loop, setLoop] = useState(false);
    const [paused, setPaused] = useState(true);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const audioRef = useRef<HTMLAudioElement>(new Audio(audioSrc));

    const getVolumeIcon = () => {
        let Icon: LucideIcon;
        if (volume.muted) {
            Icon = VolumeX;
        } else {
            if (volume.value === 0) {
                Icon = Volume;
            } else if (volume.value <= 50) {
                Icon = Volume1;
            } else {
                Icon = Volume2;
            }
        }

        return <Icon size={18} />;
    };

    const handleVolumeChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setVolume({
            value: Number.parseInt(ev.target.value),
            muted: false,
        });

        audioRef.current.volume = volume.value / 100;
    };

    const handleMute = () => {
        setVolume({
            value: volume.value,
            muted: !volume.muted,
        });

        audioRef.current.volume = volume.muted ? volume.value / 100 : 0;
    };

    const addHeadingZero = (num: number): string => {
        return num > 9 ? num.toString() : `0${num}`;
    };

    const getDisplayTimeBySeconds = (seconds: number): string => {
        const min = Math.floor(seconds / 60);
        const minStr = addHeadingZero(min);
        const secStr = addHeadingZero(Math.floor(seconds % 60));
        const minStrForHour = addHeadingZero(Math.floor(min % 60));
        const hourStr = Math.floor(min / 60);

        if (seconds >= 3600) {
            return `${hourStr}:${minStrForHour}:${secStr}`;
        } else {
            return `${minStr}:${secStr}`;
        }
    };

    const handleLoadedMetadata = () => {
        setDuration(
            Number.isFinite(audioRef.current.duration)
                ? Math.round(audioRef.current.duration * 10) / 10
                : 0,
        );
    };

    useEffect(() => {
        const audioEl = audioRef.current;
        audioEl.addEventListener("loadedmetadata", handleLoadedMetadata);
        const interval = setInterval(
            () =>
                setCurrentTime(
                    Math.round(audioRef.current.currentTime * 10) / 10,
                ),
            100,
        );

        return () => {
            clearInterval(interval);
            audioEl.removeEventListener("loadedmetadata", handleLoadedMetadata);
        };
    }, []);

    useEffect(() => {
        paused ? audioRef.current.pause() : audioRef.current.play();
    }, [paused]);

    useEffect(() => {
        audioRef.current.loop = loop;
    }, [loop]);

    return (
        <>
            <div className="h-[100px] w-[500px] bg-dark-400 grid grid-rows-2 p-5 pb-2">
                <div className="size-full flex flex-row items-center justify-center gap-4">
                    {getDisplayTimeBySeconds(currentTime)}
                    <input
                        type="range"
                        min={0}
                        max={duration}
                        className="range range-flat-primary w-full"
                        value={currentTime}
                        step={0.1}
                        onChange={(ev) => {
                            audioRef.current.currentTime = Number.parseInt(
                                ev.target.value,
                            );
                        }}
                    />
                    {getDisplayTimeBySeconds(duration)}
                </div>
                <div className="size-full grid grid-cols-3">
                    <div className="flex flex-row items-center justify-start">
                        <div
                            className={
                                "size-8 rounded-md p-2 transition duration-300 active:scale-95 " +
                                (loop
                                    ? "bg-primary hover:bg-opacity-60 active:bg-opacity-30"
                                    : "hover:bg-dark-600 active:bg-dark-500")
                            }
                            onClick={() => setLoop((loop) => !loop)}
                        >
                            <Repeat size={16} />
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-center">
                        <div
                            className="size-8 rounded-md hover:bg-dark-600 hover:-translate-x-0.5 p-2 active:bg-dark-500 transition duration-300 active:scale-95"
                            onClick={() => (audioRef.current.currentTime -= 10)}
                        >
                            <StepBack size={16} />
                        </div>
                        <div
                            className="size-10 rounded-md hover:bg-dark-600 p-2 active:bg-dark-500 transition duration-300 active:scale-95"
                            onClick={() => setPaused((paused) => !paused)}
                        >
                            {paused || audioRef.current.ended ? (
                                <Play />
                            ) : (
                                <Pause />
                            )}
                        </div>
                        <div
                            className="size-8 rounded-md hover:bg-dark-600 hover:translate-x-0.5 p-2 active:bg-dark-500 transition duration-300 active:scale-95"
                            onClick={() => (audioRef.current.currentTime += 10)}
                        >
                            <StepForward size={16} />
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 items-center justify-center">
                        <div
                            className="size-8 rounded-md hover:bg-dark-600 p-2 active:bg-dark-500 transition duration-300 active:scale-95"
                            onClick={() => handleMute()}
                        >
                            {getVolumeIcon()}
                        </div>
                        <input
                            type="range"
                            className="range range-flat-primary"
                            max={100}
                            min={0}
                            onChange={(ev) => handleVolumeChange(ev)}
                            value={volume.muted ? 0 : volume.value}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
