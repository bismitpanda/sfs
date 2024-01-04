import { useAppStateContext, useSelectedContext } from "../../context";
import { ModalProps } from "../../types";
import { getTimeString } from "../../utils";
import { Modal } from "./Modal";

export const InfoModal: React.FC<ModalProps> = ({ close, state }) => {
    const { appState } = useAppStateContext();
    const { selected } = useSelectedContext();

    const record = selected[0] || appState.currDirRecord;

    return (
        <Modal close={close} state={state} title="Info">
            <div>Name: {record.name}</div>
            <div>Path: {[...appState.workingDir, record.name].join("/")}</div>
            <div>Date Created: {getTimeString(record.fileTimes.created)}</div>
            <div>Last Modified: {getTimeString(record.fileTimes.modified)}</div>
            <div>Last Accessed: {getTimeString(record.fileTimes.accessed)}</div>
        </Modal>
    );
};
