import { ModalProps } from "../../types";
import { Modal } from "./Modal";

export const NewFileModal: React.FC<ModalProps> = ({ close, state }) => (
    <Modal state={state} close={close} title="New File">
        <button className="btn">Create</button>
    </Modal>
);
