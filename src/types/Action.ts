import { ActionType } from "./ActionType";
import { Record } from "./Record";

export type Action =
    | { type: ActionType.DELETE; payload: Record[] }
    | { type: ActionType.DELETED; payload: number[] }
    | { type: ActionType.PIN; payload: Record }
    | { type: ActionType.PINNED; payload: Record }
    | { type: ActionType.UNPIN; payload: Record }
    | { type: ActionType.UNPINNED; payload: number }
    | { type: ActionType.CREATE_FILE; payload: string }
    | { type: ActionType.CREATE_DIRECTORY; payload: string }
    | { type: ActionType.CREATED_FILE; payload: Record }
    | { type: ActionType.CREATED_DIRECTORY; payload: Record }
    | { type: ActionType.IMPORT }
    | { type: ActionType.IMPORTED; payload: Record[] }
    | { type: ActionType.EXPORT; payload: Record }
    | { type: ActionType.EXPORTED };
