import { ModalEnum, Record } from ".";

export interface ModalState {
    openModal: (modal: ModalEnum, record?: Record) => void;
}
