import { useAppStateContext } from "../../context";
import { AppActionType, ModalProps } from "../../types";
import { Modal } from "./Modal";

export const DeleteModal: React.FC<ModalProps> = ({ close, state }) => {
    const { dispatch } = useAppStateContext();

    return (
        <Modal state={state} close={close} title="Delete">
            <div className="flex flex-row gap-4">
                <button className="btn">Cancel</button>
                <button
                    className="btn bg-[#ff5a5a]"
                    onClick={() => {
                        dispatch({ type: AppActionType.DELETE });
                        close();
                    }}
                >
                    Delete
                </button>
            </div>
        </Modal>
    );
};
