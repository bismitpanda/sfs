import { ModalEnum } from "./ModalEnum";
import { Record } from "./Record";

export interface ModalState {
    openModal: (modal: ModalEnum, record?: Record) => void;
}
