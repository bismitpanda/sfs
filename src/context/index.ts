import { useContext } from "react";

import { AppStateContext } from "./AppStateContext";
import { ModalContext } from "./ModalContext";
import { SelectedContext } from "./SelectedContext";

export const useSelectedContext = () => useContext(SelectedContext);
export const useAppStateContext = () => useContext(AppStateContext);
export const useModalContext = () => useContext(ModalContext);

export { ContextProvider } from "./ContextProvider";
