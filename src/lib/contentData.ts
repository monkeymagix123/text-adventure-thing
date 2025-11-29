import { type StateData } from "./state";

export interface ContentData {
    flags?: string[];
    temporaryFlags?: string[];
    states: StateData[];
}