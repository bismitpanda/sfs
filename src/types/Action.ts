import { ActionType } from "./ActionType";
import { Record } from "./Record";

export type Action =
    | {
          type: ActionType.DELETE;
          payload: Record[];
      }
    | {
          type: ActionType.PIN;
          payload: Record;
      };
