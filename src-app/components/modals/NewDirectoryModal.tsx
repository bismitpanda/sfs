import { useAppStateContext } from "@hooks/useAppStateContext";
import { ActionType } from "@type/ActionType";
import { ModalProps } from "@type/ModalProps";
import { KeyboardEvent, useRef, useState } from "react";

import { Modal } from "./Modal";

export const NewDirectoryModal: React.FC<ModalProps> = ({ close, state }) => {
    const { appState, dispatch } = useAppStateContext();
    const inputRef = useRef<HTMLInputElement>(null);
    const [name, setName] = useState("");
    const [exists, setExists] = useState(false);

    const handleKeyDown = (ev: KeyboardEvent) => {
        if (ev.key === "Enter") {
            handleClick();
        }
    };

    const onChangeState = () => {
        inputRef.current?.focus();
    };

    const newClose = () => {
        setName("");
        close();
    };

    const handleClick = () => {
        if (appState.records.some((obj) => obj.name === name)) {
            setExists(true);
        } else if (name !== "") {
            dispatch({
                type: ActionType.CREATE,
                payload: { name, file: false },
            });
            newClose();
        }
    };

    return (
        <Modal
            state={state}
            close={newClose}
            title="New Directory"
            onChangeState={onChangeState}
        >
            <input
                className="input input-block"
                type="text"
                ref={inputRef}
                placeholder="Enter Directory name"
                onKeyDown={handleKeyDown}
                onChange={(ev) => setName(ev.target.value)}
                value={name}
            />
            <span
                className={
                    "text-red1 text-sm" +
                    (exists ? " opacity-100" : " opacity-0")
                }
            >
                A record already exists
            </span>
            <span className="w-full flex flex-row justify-end">
                <button
                    className="btn bg-green1 w-fit bg-opacity-60 text-black"
                    onClick={() => handleClick()}
                >
                    Create
                </button>
            </span>
        </Modal>
    );
};
