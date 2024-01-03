import { ActionType } from "./ActionType";
import { Record } from "./Record";

export type Action =
    | {
          type: ActionType.DELETE;
          payload: Record[];
      }
    | {
          type: ActionType.PIN | ActionType.UNPIN;
          payload: Record;
      }
    | {
          type: ActionType.CREATE_FILE | ActionType.CREATE_DIRECTORY;
          payload: string;
      }
    | {
          type: ActionType.CREATED_FILE | ActionType.CREATED_DIRECTORY;
          payload: Record;
      };
