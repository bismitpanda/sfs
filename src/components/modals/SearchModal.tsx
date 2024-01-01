import { Modal, ModalProps } from "./Modal";

export const SearchModal: React.FC<ModalProps> = ({ onClick, checked }) => (
    <Modal checked={checked} onClick={onClick} title="New File" />
);
