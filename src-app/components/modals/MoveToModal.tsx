import { useAppStateContext } from "@hooks/useAppStateContext";
import { ActionType } from "@type/ActionType";
import { ModalProps } from "@type/ModalProps";
import { Record } from "@type/Record";
import { KeyboardEvent, useRef, useState } from "react";

import { Modal } from "./Modal";

export const MoveToModal: React.FC<ModalProps & { record?: Record }> = ({
    close,
    state,
    record,
}) => {
    const { appState, dispatch } = useAppStateContext();
    const inputRef = useRef<HTMLInputElement>(null);
    const [path, setPath] = useState("");

    const handleKeyDown = (ev: KeyboardEvent) => {
        if (ev.key === "Enter") {
            handleClick();
        }
    };

    const onChangeState = () => {
        inputRef.current?.focus();
    };

    const newClose = () => {
        setPath("");
        close();
    };

    const handleClick = () => {
        if (path !== "") {
            dispatch({
                type: ActionType.SEND,
                payload: {
                    ids:
                        record !== undefined
                            ? [record.id]
                            : appState.selected.map((obj) => obj.id),
                    path:
                        path === "/" ? [] : path.replace(/^\//g, "").split("/"),
                },
            });
            newClose();
        }
    };

    return (
        <Modal
            state={state}
            close={newClose}
            title="Send To"
            onChangeState={onChangeState}
        >
            <input
                className="input input-block"
                type="text"
                ref={inputRef}
                placeholder="Enter path"
                onKeyDown={handleKeyDown}
                onChange={(ev) => setPath(ev.target.value)}
                value={path}
            />
            <span className="w-full flex flex-row justify-end">
                <button
                    className="btn bg-green1 w-fit bg-opacity-60 text-black"
                    onClick={() => handleClick()}
                >
                    Send
                </button>
            </span>
        </Modal>
    );
};
