import { ModalProps } from "../../types";
import { Modal } from "./Modal";

export const NewFolderModal: React.FC<ModalProps> = ({ close, state }) => (
    <Modal state={state} close={close} title="New Folder">
        <button className="btn">Create</button>
    </Modal>
);
