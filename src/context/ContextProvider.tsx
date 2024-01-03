import { invoke } from "@tauri-apps/api";
import { useCallback, useReducer, useState } from "react";

import {
    DeleteModal,
    InfoModal,
    NewDirectoryModal,
    NewFileModal,
    PropertiesModal,
    SettingsModal,
} from "../components/modals";
import { Action, ActionType, AppState, ModalEnum, Record } from "../types";
import { AppStateContext } from "./AppStateContext";
import { ModalContext } from "./ModalContext";
import { SelectedContext } from "./SelectedContext";
import { appStateReducer } from "./appStateReducer";

export const ContextProvider: React.FC<{
    children: React.ReactNode;
    initialAppState: AppState;
}> = ({ children, initialAppState }) => {
    const [selected, setSelected] = useState<Record[]>([]);

    const defaultModals = {
        settings: false,
        properties: false,
        newFile: false,
        newDirectory: false,
        info: false,
        delete: false,
    };
    const [modals, setModals] = useState(defaultModals);
    const [appState, dispatch] = useReducer(appStateReducer, initialAppState);

    const closeModal = () => setModals(defaultModals);
    const asyncDispatch = useCallback(async (action: Action) => {
        switch (action.type) {
            case ActionType.CREATE_FILE: {
                const record = await invoke<Record>("create_file", {
                    name: action.payload,
                });
                dispatch({ type: ActionType.CREATED_FILE, payload: record });
                break;
            }

            case ActionType.CREATE_DIRECTORY: {
                const record = await invoke<Record>("create_directory", {
                    name: action.payload,
                });
                dispatch({ type: ActionType.CREATED_FILE, payload: record });
                break;
            }

            default:
                dispatch(action);
                break;
        }
    }, []);

    return (
        <AppStateContext.Provider value={{ appState, dispatch: asyncDispatch }}>
            <SelectedContext.Provider value={{ selected, setSelected }}>
                <ModalContext.Provider
                    value={{
                        openModal: (modal: ModalEnum) =>
                            setModals({ ...defaultModals, [modal]: true }),
                    }}
                >
                    <SettingsModal state={modals.settings} close={closeModal} />
                    <PropertiesModal
                        state={modals.properties}
                        close={closeModal}
                    />
                    <NewFileModal state={modals.newFile} close={closeModal} />
                    <NewDirectoryModal
                        state={modals.newDirectory}
                        close={closeModal}
                    />
                    <InfoModal state={modals.info} close={closeModal} />
                    <DeleteModal state={modals.delete} close={closeModal} />
                    {children}
                </ModalContext.Provider>
            </SelectedContext.Provider>
        </AppStateContext.Provider>
    );
};
