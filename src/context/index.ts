import { useContext } from "react";

import { AppStateContext } from "./appState";
import { ModalContext } from "./modal";
import { SelectedContext } from "./selected";

export const useSelectedContext = () => useContext(SelectedContext);
export const useAppStateContext = () => useContext(AppStateContext);
export const useModalContext = () => useContext(ModalContext);

export { ContextProvider } from "./ContextProvider";
