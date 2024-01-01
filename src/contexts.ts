import { Dispatch, SetStateAction, createContext } from "react";

export const SelectedContext = createContext<{
    selected?: number;
    setSelected: Dispatch<SetStateAction<number | undefined>>;
}>({
    selected: 0,
    setSelected: (num: SetStateAction<number | undefined>) => {
        console.log(num);
    },
});
