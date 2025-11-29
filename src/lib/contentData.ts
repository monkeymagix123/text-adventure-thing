import { type StateData } from "./state";

export interface ContentData {
    flags?: string[];
    states: StateData[];
}