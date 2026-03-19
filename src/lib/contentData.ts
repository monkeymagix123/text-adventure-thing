import { type StateData } from "./state";

export interface ContentData {
    flags?: string[];
    sessionFlags?: string[];
    states: StateData[];
}