import { Dispatch, SetStateAction, createContext } from "react";

interface State {
    selected: number[];
    setSelected: Dispatch<SetStateAction<number[]>>;
}

const initialState: State = {
    selected: [],
    setSelected: (num: SetStateAction<number[]>) => {
        console.log(num);
    },
};

export const SelectedContext = createContext<State>(initialState);
