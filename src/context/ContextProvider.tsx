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
import { SelectedContext } from "./SelectedContext";

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
    const [modals, setModals] = useState<{
        values: {
            settings: boolean;
            properties: boolean;
            newFile: boolean;
            newDirectory: boolean;
            info: boolean;
            delete: boolean;
        };
        record?: Record;
    }>({
        values: defaultModals,
    });

    const [appState, dispatch] = useReducer(appStateReducer, initialAppState);

    const closeModal = () =>
        setModals({ values: defaultModals, record: undefined });

    const asyncDispatch = useAsyncDispatch(dispatch);

    return (
        <AppStateContext.Provider value={{ appState, dispatch: asyncDispatch }}>
            <SelectedContext.Provider value={{ selected, setSelected }}>
                <ModalContext.Provider
                    value={{
                        openModal: (modal: ModalEnum, record?: Record) => {
                            setModals({
                                values: { ...defaultModals, [modal]: true },
                                record,
                            });
                        },
                    }}
                >
                    <SettingsModal
                        state={modals.values.settings}
                        close={closeModal}
                    />
                    <PropertiesModal
                        state={modals.values.properties}
                        close={closeModal}
                    />
                    <NewFileModal
                        state={modals.values.newFile}
                        close={closeModal}
                    />
                    <NewDirectoryModal
                        state={modals.values.newDirectory}
                        close={closeModal}
                    />
                    <InfoModal
                        record={modals.record}
                        state={modals.values.info}
                        close={closeModal}
                    />
                    <DeleteModal
                        state={modals.values.delete}
                        close={closeModal}
                    />
                    {children}
                </ModalContext.Provider>
            </SelectedContext.Provider>
        </AppStateContext.Provider>
    );
};
