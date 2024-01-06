import { useRef } from "react";

import { useAppStateContext } from "../../hooks";
import { ActionType, ModalProps } from "../../types";
import { Modal } from "./Modal";

export const NewFileModal: React.FC<ModalProps> = ({ close, state }) => {
    const { dispatch } = useAppStateContext();
    const fileNameRef = useRef<HTMLInputElement>(null);

    return (
        <Modal state={state} close={close} title="New File">
            <input
                autoFocus
                className="input input-block"
                type="text"
                name="fileNameInput"
                ref={fileNameRef}
                placeholder="Enter File name"
            />
            <button
                className="btn bg-[#56df74] bg-opacity-60 text-black"
                onClick={() => {
                    if (
                        fileNameRef.current !== null &&
                        fileNameRef.current.value !== ""
                    ) {
                        dispatch({
                            type: ActionType.CREATE_FILE,
                            payload: fileNameRef.current.value,
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
