import { useAsyncDispatch } from "@hooks/useAsyncDispatch";
import { DeleteModal } from "@modals/DeleteModal";
import { InfoModal } from "@modals/InfoModal";
import { NewDirectoryModal } from "@modals/NewDirectoryModal";
import { NewFileModal } from "@modals/NewFileModal";
import { PropertiesModal } from "@modals/PropertiesModal";
import { SettingsModal } from "@modals/SettingsModal";
import { AppState } from "@type/AppState";
import { ModalEnum } from "@type/ModalEnum";
import { Record } from "@type/Record";
import { useReducer, useState } from "react";

import { appStateReducer } from "../appStateReducer";
import { AppStateContext } from "./AppStateContext";
import { ModalContext } from "./ModalContext";

export const ContextProvider: React.FC<{
    children: React.ReactNode;
    initialAppState: AppState;
}> = ({ children, initialAppState }) => {
    const defaultModals = {
        settings: false,
        properties: false,
        newFile: false,
        newDirectory: false,
        info: false,
        delete: false,
    };
    const [modals, setModals] = useState<{
        settings: boolean;
        properties: boolean;
        newFile: boolean;
        newDirectory: boolean;
        info: boolean;
        delete: boolean;
    }>(defaultModals);

    const [appState, dispatch] = useReducer(appStateReducer, initialAppState);
    const [record, setRecord] = useState(appState.workingDirRecord);

    const closeModal = () => setModals(defaultModals);

    const asyncDispatch = useAsyncDispatch(dispatch);

    return (
        <AppStateContext.Provider value={{ appState, dispatch: asyncDispatch }}>
            <ModalContext.Provider
                value={{
                    openModal: (modal: ModalEnum, record?: Record) => {
                        setModals({ ...defaultModals, [modal]: true });
                        if (record) setRecord(record);
                        else setRecord(appState.workingDirRecord);
                    },
                }}
            >
                <SettingsModal state={modals.settings} close={closeModal} />
                <PropertiesModal state={modals.properties} close={closeModal} />
                <NewFileModal state={modals.newFile} close={closeModal} />
                <NewDirectoryModal
                    state={modals.newDirectory}
                    close={closeModal}
                />
                <InfoModal
                    state={modals.info}
                    close={closeModal}
                    record={record}
                />
                <DeleteModal state={modals.delete} close={closeModal} />
                {children}
            </ModalContext.Provider>
        </AppStateContext.Provider>
    );
};
