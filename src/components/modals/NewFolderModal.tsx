import { Modal, ModalProps } from "./Modal";

export const NewFolderModal: React.FC<ModalProps> = ({ onClick, checked }) => (
    <Modal checked={checked} onClick={onClick} title="New Folder" />
);
