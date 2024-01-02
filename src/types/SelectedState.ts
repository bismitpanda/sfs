import { Dispatch, SetStateAction } from "react";

export interface SelectedState {
    selected: number[];
    setSelected: Dispatch<SetStateAction<number[]>>;
}
