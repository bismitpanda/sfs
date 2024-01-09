import { ActionType } from "./ActionType";
import { PathSegment } from "./PathSegment";
import { Record } from "./Record";

export type Action =
    | { type: ActionType.DELETE; payload: Record[] }
    | { type: ActionType.DELETED; payload: number[] }
    | { type: ActionType.PIN; payload: Record }
    | { type: ActionType.PINNED; payload: Record }
    | { type: ActionType.UNPIN; payload: number }
    | { type: ActionType.UNPINNED; payload: number }
    | { type: ActionType.CREATE; payload: { name: string; file: boolean } }
    | { type: ActionType.CREATED; payload: Record }
    | { type: ActionType.IMPORT }
    | { type: ActionType.IMPORTED; payload: Record[] }
    | { type: ActionType.EXPORT; payload: Record }
    | { type: ActionType.DROP; payload: string[] }
    | { type: ActionType.DROPPED; payload: Record[] }
    | { type: ActionType.SET_SELECTED; payload: Record[] }
    | {
          type: ActionType.RENAME | ActionType.RENAMED;
          payload: { newName: string; oldName: string };
      }
    | {
          type: ActionType.CHANGE_DIRECTORY;
          payload: { id: number; path: PathSegment[] };
      }
    | {
          type: ActionType.CHANGED_DIRECTORY;
          payload: { returned: [Record, Record[]]; path: PathSegment[] };
      };
