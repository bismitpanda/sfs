import { ModalProps } from "@type/ModalProps";

import { PathInput } from "../inputs";
import { Modal } from "./Modal";

export const SettingsModal: React.FC<ModalProps> = (props) => (
    <Modal {...props} title="Settings">
        <PathInput placeholder="Metadata Path" />
        <PathInput placeholder="Config Path" />
        <PathInput placeholder="Storage Path" />
        <button className="btn w-20">Save</button>
    </Modal>
);
