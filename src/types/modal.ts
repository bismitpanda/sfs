export enum ModalEnum {
    SETTINGS = "settings",
    PROPERTIES = "properties",
    NEW_FILE = "newFile",
    NEW_FOLDER = "newFolder",
    INFO = "info",
    DELETE = "delete",
}

export interface ModalState {
    openModal: (modal: ModalEnum) => void;
}

export interface ModalProps {
    close: () => void;
    state: boolean;
}
