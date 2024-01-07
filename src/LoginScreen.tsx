import { invoke } from "@tauri-apps/api";
import { exit } from "@tauri-apps/api/process";
import { KeyboardEvent, useEffect, useRef, useState } from "react";

export const LoginScreen: React.FC = () => {
    const [password, setPassword] = useState("");

    const handleKeyDown = (ev: KeyboardEvent) => {
        if (ev.key === "Enter" && password !== "") {
            invoke("login", { password });
        }
    };

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <div className="rounded-3xl bg-dark-200 h-screen w-screen p-5 flex flex-col gap-5 items-center">
            <h2 className="text-xl">Enter Password</h2>
            <input
                type="password"
                className="input input-block"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                ref={inputRef}
                onKeyDown={handleKeyDown}
            />
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
