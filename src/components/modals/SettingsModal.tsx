import { Modal, ModalProps } from "./Modal";
import { PathInput } from "../inputs/PathInput";

export const SettingsModal: React.FC<ModalProps> = ({ onClick, checked }) => (
    <Modal onClick={onClick} checked={checked} title="Settings">
        <PathInput placeholder="Metadata Path" />
        <PathInput placeholder="Config Path" />
        <PathInput placeholder="Storage Path" />
        <button className="btn w-20">Save</button>
    </Modal>
);
