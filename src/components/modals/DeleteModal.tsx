import { useAppStateContext } from "@hooks/useAppStateContext";
import { ActionType } from "@type/ActionType";
import { ModalProps } from "@type/ModalProps";

import { Modal } from "./Modal";

export const DeleteModal: React.FC<ModalProps> = ({ close, state }) => {
    const { appState, dispatch } = useAppStateContext();

    return (
        <Modal state={state} close={close}>
            Are you sure you want to delete
            {appState.selected.length > 1
                ? ` ${appState.selected.length} files`
                : ` "${appState.selected[0]?.name}"`}
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
                            payload: appState.selected,
                        });
                        close();
                    }}
                >
                    Delete
                </button>
            </div>
        </Modal>
    );
};
