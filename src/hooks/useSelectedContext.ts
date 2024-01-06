import { useContext } from "react";

import { SelectedContext } from "../context";

export const useSelectedContext = () => useContext(SelectedContext);
