import { createContext } from "react";

import { ModalEnum, ModalState } from "../types";

const initialState: ModalState = {
    openModal: (_: ModalEnum) => {},
};

export const ModalContext = createContext<ModalState>(initialState);
