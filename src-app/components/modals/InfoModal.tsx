import { useAppStateContext } from "@hooks/useAppStateContext";
import { ModalProps } from "@type/ModalProps";
import { Record } from "@type/Record";
import { getTimeString } from "@utils/getTimeString";

import { Modal } from "./Modal";

export const InfoModal: React.FC<ModalProps & { record: Record }> = ({
    record,
    ...props
}) => {
    const { appState } = useAppStateContext();

    return (
        <Modal {...props} title="Info">
            <div className="flex flex-col gap-2 justify-start w-full">
                <div>
                    <span className="font-bold">Name:</span> {record.name}
                </div>
                <div>
                    <span className="font-bold">Path:</span>{" "}
                    {[
                        "",
                        ...appState.workingDir.map((segment) => segment.name),
                        record.name,
                    ].join("/")}
                </div>
                <div>
                    <span className="font-bold">Date Created:</span>{" "}
                    {getTimeString(record.file_times.created)}
                </div>
                <div>
                    <span className="font-bold">Last Modified:</span>{" "}
                    {getTimeString(record.file_times.modified)}
                </div>
                <div>
                    <span className="font-bold">Last Accessed:</span>{" "}
                    {getTimeString(record.file_times.accessed)}
                </div>
            </div>
        </Modal>
    );
};
