import { ModalProps } from "@type/ModalProps";

import { Modal } from "./Modal";

export const PropertiesModal: React.FC<ModalProps> = ({ close, state }) => (
    <Modal close={close} state={state} title="Properties" />
);
