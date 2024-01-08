import { useAppStateContext } from "@hooks/useAppStateContext";
import { ActionType } from "@type/ActionType";
import { ModalProps } from "@type/ModalProps";
import { KeyboardEvent, useRef, useState } from "react";

import { Modal } from "./Modal";

export const NewDirectoryModal: React.FC<ModalProps> = ({ close, state }) => {
    const { dispatch } = useAppStateContext();
    const inputRef = useRef<HTMLInputElement>(null);
    const [name, setName] = useState("");

    const handleKeyDown = (ev: KeyboardEvent) => {
        if (ev.key === "Enter" && name !== "") {
            dispatch({
                type: ActionType.CREATE_DIRECTORY,
                payload: name,
            });
            newClose();
        }
    };

    const onChangeState = () => {
        inputRef.current?.focus();
    };

    const newClose = () => {
        setName("");
        close();
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
                name="directoryNameInput"
                ref={inputRef}
                placeholder="Enter Directory name"
                onKeyDown={handleKeyDown}
                onChange={(ev) => setName(ev.target.value)}
                value={name}
            />
            <span className="w-full flex flex-row justify-end">
                <button
                    className="btn bg-green1 w-fit bg-opacity-60 text-black"
                    onClick={() => {
                        if (name !== "") {
                            dispatch({
                                type: ActionType.CREATE_DIRECTORY,
                                payload: name,
                            });
                            newClose();
                        }
                    }}
                >
                    Create
                </button>
            </span>
        </Modal>
    );
};
