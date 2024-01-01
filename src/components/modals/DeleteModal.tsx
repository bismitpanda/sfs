import { invoke } from "@tauri-apps/api";

import { Modal, ModalProps } from "./Modal";

export const DeleteModal: React.FC<ModalProps> = ({ close, state }) => (
    <Modal state={state} close={close} title="Delete">
        <div className="flex flex-row gap-4">
            <button className="btn">Cancel</button>
            <button
                className="btn bg-[#ff5a5a]"
                onClick={() => {
                    invoke("").then(close);
                }}
            >
                Delete
            </button>
        </div>
    </Modal>
);
