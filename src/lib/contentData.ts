import { type StateData } from "./state";

export interface ContentData {
    /** Permanent progression flags. */
    flags?: string[];
    /** Temporary/session progression flags. */
    sessionFlags?: string[];
    states: StateData[];
}