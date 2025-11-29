import { setState } from "./pos.svelte";

import { hasAllFlags, setFlag } from "./flags";

export class State {
    title: string;   
    description: string;

    reqDesc?: ReqDesc[];
    onEnter?: InterStateData;
    onExit?: InterStateData;

    visitCount: number = 0;

    // url: string;

    options: Action[];

    constructor(data: StateData | string, description?: string) {
        if (typeof data === "string") {
            // user put a title for the data slot
            this.title = data;
            this.description = description ?? "No description provided.";

            this.options = new Array<Action>();

            return;
        }

        this.title = data.title;
        this.description = data.description;

        this.reqDesc = data["req-desciptions"];
        this.onEnter = data["on-enter"];
        this.onExit = data["on-exit"];

        this.options = new Array<Action>();
    }

    addOption(action: string, state: State) {
        const option: Action = {
            action: action,
            state: state
        } as Action;

        this.options.push(option);
    }
    
    doOption(action: Action) {
        setState(action.state);

        this.exitState();
    }

    copyOptions(other: State) {
        this.options = other.options;
    }


    getDescription() {
        let desc = this.description;

        if (!this.reqDesc) return desc;

        for (const flagData of this.reqDesc) {
            const req = flagData.reqs;

            const flagsEnough = !req.flags || hasAllFlags(req.flags);
            const visitEnough = !req["visit-count"] || this.visitCount >= req["visit-count"];

            if (flagsEnough && visitEnough) {
                desc = flagData.description; // later flags are rarer and have higher priority
            }
        }

        return desc;
    }

    // actions on enter and on exit
    enterState() {
        if (this.onEnter !== undefined) {
            for (const flag of this.onEnter["unlock-flags"]!) {
                setFlag(flag, true);
            }
        }
    }

    exitState() {
        this.visitCount++;

        // Unlock all flags that are unlocked on exit
        if (this.onExit !== undefined) {
            for (const flag of this.onExit["unlock-flags"]!) {
                setFlag(flag, true);
            }
        }
    }
}

export interface Action {
    action: string;
    state: State;
}

export interface StateData {
    id: string;
    isStage?: boolean;
    title: string;
    description: string;
    "req-desciptions"?: ReqDesc[];
    options?: ActionData[];
    "copy-options"?: string;
    // fail?: string;
    "on-enter"?: InterStateData;
    "on-exit"?: InterStateData;
}

interface ReqDesc {
    reqs: Requirements;
    description: string;
}

interface Requirements {
    flags?: string[];
    "visit-count"?: number;
}

export interface InterStateData {
    "unlock-flags"?: string[];
}

interface ActionData {
    action: string;
    state: string;
}

export function loadOption(states: Map<string, State>, data: StateData): boolean {
    const theState = states.get(data.id)!;

    if (data.isStage) {
        return false; // need to handle this specially
    }

    if (data["copy-options"] !== undefined) {
        theState.copyOptions(states.get(data["copy-options"])!);
    } else {
        for (const option of data.options!) {
            theState.addOption(option.action, states.get(option.state)!)
        }
    }

    return true;
}