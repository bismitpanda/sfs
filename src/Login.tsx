import "@fontsource/space-grotesk/latin-400.css";
import { invoke } from "@tauri-apps/api";
import { exit } from "@tauri-apps/api/process";
import React from "react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";

export const LoginScreen: React.FC = () => {
    const [password, setPassword] = useState("");
    const [incorrect, setIncorrect] = useState(false);

    const handleKeyDown = (ev: KeyboardEvent) => {
        if (incorrect) {
            setIncorrect(false);
        }

        if (ev.key === "Enter" && password !== "") {
            invoke("check_password", { password })
                .then(() => {
                    invoke("login", { password });
                })
                .catch(() => setIncorrect(true));
        }
    };

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <div className="rounded-3xl bg-dark-200 h-screen w-screen p-5 flex flex-col gap-5 items-center">
            <h2 className="text-xl">Enter Password</h2>
            <div
                className={"flex flex-col w-full" + (incorrect ? "" : " pb-5")}
            >
                <input
                    type="password"
                    className="input input-block"
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                    ref={inputRef}
                    onKeyDown={handleKeyDown}
                />
                {incorrect && (
                    <span className="text-sm text-red1">
                        Incorrect password!
                    </span>
                )}
            </div>
            <div className="flex flex-row w-full justify-end items-center gap-3">
                <button className="btn" onClick={() => exit(0)}>
                    Cancel
                </button>
                <button
                    disabled={password === ""}
                    className="btn btn-primary"
                    onClick={() => invoke("login", { password })}
                >
                    Login
                </button>
            </div>
        </div>
    );
};
