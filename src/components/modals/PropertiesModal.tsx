import { Modal, ModalProps } from "./Modal";

export const PropertiesModal: React.FC<ModalProps> = ({ onClick, checked }) => (
    <Modal onClick={onClick} checked={checked} title="Properties" />
);
