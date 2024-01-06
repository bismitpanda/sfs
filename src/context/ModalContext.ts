import { ModalEnum } from "@type/ModalEnum";
import { ModalState } from "@type/ModalState";
import { Record } from "@type/Record";
import { createContext } from "react";

const initialState: ModalState = {
    openModal: (_: ModalEnum, __?: Record) => {},
};

export const ModalContext = createContext<ModalState>(initialState);
