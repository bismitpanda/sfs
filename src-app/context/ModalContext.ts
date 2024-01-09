import { ModalEnum } from "@type/ModalEnum";
import { ModalState } from "@type/ModalState";
import { createContext } from "react";

const initialState: ModalState = {
    openModal: (_: ModalEnum) => {},
};

export const ModalContext = createContext<ModalState>(initialState);
