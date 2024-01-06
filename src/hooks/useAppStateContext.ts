import { useContext } from "react";

import { AppStateContext } from "../context";

export const useAppStateContext = () => useContext(AppStateContext);
