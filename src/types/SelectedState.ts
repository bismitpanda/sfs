import { Dispatch, SetStateAction } from "react";

import { Record } from ".";

export interface SelectedState {
    selected: Record[];
    setSelected: Dispatch<SetStateAction<Record[]>>;
}
