import { AppStateContext } from "@context/AppStateContext";
import { useContext } from "react";

export const useAppStateContext = () => useContext(AppStateContext);
