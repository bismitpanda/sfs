import { ModalEnum } from "./ModalEnum";

export interface ModalState {
    openModal: (modal: ModalEnum) => void;
}
