import { createContext } from "react";

export enum ModalEnum {
    SETTINGS = "settings",
    PROPERTIES = "properties",
    NEW_FILE = "newFile",
    NEW_FOLDER = "newFolder",
    SEARCH = "search",
    INFO = "info",
    DELETE = "delete",
}

interface State {
    openModal: (modal: ModalEnum) => void;
}

const initialState: State = {
    openModal: (modal: ModalEnum) => {
        console.log(modal);
    },
};

export const ModalContext = createContext<State>(initialState);
