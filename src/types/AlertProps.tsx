import { AlertType } from ".";

export interface AlertProps {
    content: string;
    open: boolean;
    type: AlertType;
}
