import { useAppStateContext } from "@hooks/useAppStateContext";
import { useSelectedContext } from "@hooks/useSelectedContext";
import { ActionType } from "@type/ActionType";
import { ModalProps } from "@type/ModalProps";

import { Modal } from "./Modal";

export const DeleteModal: React.FC<ModalProps> = ({ close, state }) => {
    const { dispatch } = useAppStateContext();
    const { selected, setSelected } = useSelectedContext();

    return (
        <Modal state={state} close={close}>
            Are you sure you want to delete
            {selected.length > 1
                ? ` ${selected.length} files`
                : ` "${selected[0]?.name}"`}
            ?
            <div className="flex flex-row gap-4 w-full justify-end">
                <button className="btn" onClick={() => close()}>
                    Cancel
                </button>
                <button
                    className="btn bg-red1"
                    onClick={() => {
                        dispatch({
                            type: ActionType.DELETE,
                            payload: selected,
                        });
                        setSelected([]);
                        close();
                    }}
                >
                    Delete
                </button>
            </div>
        </Modal>
    );
};
