import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";

import { AlertProps } from "../types";

export const Alert: React.FC<AlertProps> = ({ open, content, type }) => {
    return (
        <LazyMotion features={domAnimation}>
            <AnimatePresence>
                {open && (
                    <m.div
                        initial={{ opacity: 0, x: 100, scale: 0.3 }}
                        animate={{ opacity: 1, x: 100, scale: 1 }}
                        exit={{
                            opacity: 0,
                            scale: 0.5,
                            x: 100,
                            transition: { duration: 0.2 },
                        }}
                    >
                        {content}
                    </m.div>
                )}
            </AnimatePresence>
        </LazyMotion>
    );
};
