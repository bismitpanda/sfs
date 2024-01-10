import { useEffect } from "react";

export const Modal: React.FC<{
    close: () => void;
    state: boolean;
    title?: string;
    children?: React.ReactNode;
    onChangeState?: () => void;
}> = ({ close, state, title, children, onChangeState }) => {
    useEffect(() => {
        setTimeout(() => onChangeState?.(), 10);
    }, [state, onChangeState]);

    return (
        <div className={`modal ${state ? "!opacity-100 !visible" : ""}`}>
            <div className="modal-overlay" onClick={close}></div>
            <div className="modal-content flex flex-col gap-5 border bg-dark-50 border-dark-300 w-full items-center pt-8">
                <div
                    className="btn btn-xs btn-circle btn-ghost absolute right-0.5 top-0.5 text-xl"
                    onClick={close}
                >
                    &times;
                </div>
                {title && <h2 className="text-2xl">{title}</h2>}
                {children}
            </div>
        </div>
    );
};
