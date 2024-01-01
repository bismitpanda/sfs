import { PathInput } from "../inputs/PathInput";
import { Modal, ModalProps } from "./Modal";

export const SettingsModal: React.FC<ModalProps> = ({ close, state }) => (
    <Modal close={close} state={state} title="Settings">
        <PathInput placeholder="Metadata Path" />
        <PathInput placeholder="Config Path" />
        <PathInput placeholder="Storage Path" />
        <button className="btn w-20">Save</button>
    </Modal>
);
