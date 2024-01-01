import { Modal, ModalProps } from "./Modal";

export const SearchModal: React.FC<ModalProps> = ({ close, state }) => (
    <Modal state={state} close={close} title="Search" />
);
