import { Record } from "@type/Record";
import { Dispatch, SetStateAction } from "react";

export interface SelectedState {
    selected: Record[];
    setSelected: Dispatch<SetStateAction<Record[]>>;
}
