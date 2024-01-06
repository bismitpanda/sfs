import { useRef } from "react";

import { useAppStateContext } from "../../hooks";
import { ActionType, ModalProps } from "../../types";
import { Modal } from "./Modal";

export const NewDirectoryModal: React.FC<ModalProps> = ({ close, state }) => {
    const { dispatch } = useAppStateContext();
    const directoryNameRef = useRef<HTMLInputElement>(null);

    return (
        <Modal state={state} close={close} title="New Directory">
            <input
                autoFocus
                className="input input-block"
                type="text"
                name="directoryNameInput"
                ref={directoryNameRef}
                placeholder="Enter Directory name"
            />
            <button
                className="btn bg-[#56df74] bg-opacity-60 text-black"
                onClick={() => {
                    if (
                        directoryNameRef.current !== null &&
                        directoryNameRef.current.value !== ""
                    ) {
                        dispatch({
                            type: ActionType.CREATE_DIRECTORY,
                            payload: directoryNameRef.current.value,
                        });
                        close();
                    }
                }}
            >
                Create
            </button>
        </Modal>
    );
};
