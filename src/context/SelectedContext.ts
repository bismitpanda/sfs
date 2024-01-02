import { SetStateAction, createContext } from "react";

import { Record, SelectedState } from "../types";

const initialState: SelectedState = {
    selected: [],
    setSelected: (_: SetStateAction<Record[]>) => {},
};

export const SelectedContext = createContext<SelectedState>(initialState);
