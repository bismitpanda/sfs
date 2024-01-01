import { Modal, ModalProps } from "./Modal";

export const InfoModal: React.FC<ModalProps> = ({ close, state }) => (
    <Modal close={close} state={state} title="Info" />
);
