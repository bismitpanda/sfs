import { useContext } from "react";

import { ModalContext } from "../context";

export const useModalContext = () => useContext(ModalContext);
