import { useReducer, useState } from "react";

import {
    DeleteModal,
    InfoModal,
    NewFileModal,
    NewFolderModal,
    PropertiesModal,
    SettingsModal,
} from "../components/modals";
import { AppState, ModalEnum, Record } from "../types";
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
        newFolder: false,
        info: false,
        delete: false,
    };
    const [modals, setModals] = useState(defaultModals);
    const [appState, dispatch] = useReducer(appStateReducer, initialAppState);

    const closeModal = () => setModals(defaultModals);

    return (
        <AppStateContext.Provider value={{ appState, dispatch }}>
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
                    <NewFolderModal
                        state={modals.newFolder}
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
