import { useAppStateContext } from "@hooks/useAppStateContext";
import { ActionType } from "@type/ActionType";
import { ModalProps } from "@type/ModalProps";
import { KeyboardEvent, useEffect, useRef, useState } from "react";

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
            close();
        }
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <Modal state={state} close={close} title="New Directory">
            <input
                className="input input-block"
                type="text"
                name="directoryNameInput"
                ref={inputRef}
                placeholder="Enter Directory name"
                onKeyDown={handleKeyDown}
                onChange={(ev) => setName(ev.target.value)}
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
                            close();
                        }
                    }}
                >
                    Create
                </button>
            </span>
        </Modal>
    );
};
