export const Modal: React.FC<{
    close: () => void;
    state: boolean;
    title?: string;
    children?: React.ReactNode;
}> = ({ close, state, title, children }) => (
    <>
        <div className={`modal ${state ? "!opacity-100 !visible" : ""}`}>
            <div className="modal-overlay" onClick={close}></div>
            <div className="modal-content flex flex-col gap-5 bg-[#1a1a1a] w-full items-stretch">
                <div
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-xl"
                    onClick={close}
                >
                    &times;
                </div>
                {title && <h2 className="text-2xl">{title}</h2>}
                {children}
            </div>
        </div>
    </>
);
