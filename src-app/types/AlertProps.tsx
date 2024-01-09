import { AlertType } from "./AlertType";

export interface AlertProps {
    content: string;
    open: boolean;
    type: AlertType;
}
