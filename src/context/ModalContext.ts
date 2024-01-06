import { createContext } from "react";

import { ModalEnum, ModalState, Record } from "../types";

const initialState: ModalState = {
    openModal: (_: ModalEnum, __?: Record) => {},
};

export const ModalContext = createContext<ModalState>(initialState);
