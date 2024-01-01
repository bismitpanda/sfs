import { Modal, ModalProps } from "./Modal";

export const PropertiesModal: React.FC<ModalProps> = ({ close, state }) => (
    <Modal close={close} state={state} title="Properties" />
);
