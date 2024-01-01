import { Modal, ModalProps } from "./Modal";

export const NewFileModal: React.FC<ModalProps> = ({ onClick, checked }) => (
    <Modal checked={checked} onClick={onClick} title="New File" />
);
