import { createContext } from "react";

import { ModalEnum, ModalState } from "../types";

const initialState: ModalState = {
    openModal: (modal: ModalEnum) => {
        console.log(modal);
    },
};

export const ModalContext = createContext<ModalState>(initialState);
