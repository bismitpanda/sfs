import { SetStateAction, createContext } from "react";

import { SelectedState } from "../types";

const initialState: SelectedState = {
    selected: [],
    setSelected: (num: SetStateAction<number[]>) => {
        console.log(num);
    },
};

export const SelectedContext = createContext<SelectedState>(initialState);
