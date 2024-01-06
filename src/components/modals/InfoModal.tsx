import { useAppStateContext, useSelectedContext } from "../../hooks";
import { ModalProps, Record } from "../../types";
import { getTimeString } from "../../utils";
import { Modal } from "./Modal";

export const InfoModal: React.FC<ModalProps & { record?: Record }> = ({
    close,
    state,
    record,
}) => {
    const { appState } = useAppStateContext();
    const { selected } = useSelectedContext();

    record =
        record !== undefined
            ? record
            : selected.length > 0
              ? selected[0]
              : appState.currDirRecord;

    return (
        <Modal close={close} state={state} title="Info">
            <div>Name: {record.name}</div>
            <div>Path: {[...appState.workingDir, record.name].join("/")}</div>
            <div>Date Created: {getTimeString(record.file_times.created)}</div>
            <div>
                Last Modified: {getTimeString(record.file_times.modified)}
            </div>
            <div>
                Last Accessed: {getTimeString(record.file_times.accessed)}
            </div>
        </Modal>
    );
};
