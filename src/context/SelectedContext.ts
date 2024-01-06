import { Record } from "@type/Record";
import { SelectedState } from "@type/SelectedState";
import { SetStateAction, createContext } from "react";

const initialState: SelectedState = {
    selected: [],
    setSelected: (_: SetStateAction<Record[]>) => {},
};

export const SelectedContext = createContext<SelectedState>(initialState);
