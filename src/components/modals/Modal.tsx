export const Modal: React.FC<{
    onClick: () => void;
    checked: boolean;
    title: string;
    children?: React.ReactNode;
}> = ({ onClick, checked, title, children }) => (
    <>
        <div className={`modal ${checked ? "!opacity-100 !visible" : ""}`}>
            <div className="modal-overlay" onClick={onClick}></div>
            <div className="modal-content flex flex-col gap-5 bg-[#1a1a1a] w-full items-center">
                <div
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={onClick}
                >
                    &times;
                </div>
                <h2 className="text-2xl">{title}</h2>
                {children}
            </div>
        </div>
    </>
);

export interface ModalProps {
    onClick: () => void;
    checked: boolean;
}
