import { setState } from "./pos.svelte";

import { setFlag } from "./flags";
import { util, type Requirements } from "./util";

export class State {
    title: string;   
    description: string; // default description

    reqDesc?: Desc[];
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

    // option modification functions
    addOption(action: string, state: State, reqs?: Requirements): void {
        const option: Action = {
            action: action,
            state: state,
            reqs: reqs
        } as Action;

        this.options.push(option);
    }
    
    doOption(action: Action): void {
        setState(action.state);

        this.exitState();
    }

    copyOptions(other: State): void {
        this.options = other.options;
    }


    // getters
    getDescription(): string {
        let desc = this.description;

        if (!this.reqDesc) return desc;

        for (const flagData of this.reqDesc) {
            // later flags are rarer and have higher priority
            if (util.checkReqs(this, flagData.reqs)) {
                desc = flagData.description;
            }
        }

        return desc;
    }

    
    /**
     * Get all options that are currently available based on the state's requirements.
     * @returns {Action[]} An array of all available options.
     */
    getOptions(): Action[] {
        const options = new Array<Action>();

        for (const option of this.options) {
            if (util.checkReqs(this, option.reqs)) {
                options.push(option);
            }
        }

        return options;
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
    reqs?: Requirements;
}

export interface StateData {
    id: string;
    isStage?: boolean;
    title: string;
    description: string;
    "req-desciptions"?: Desc[];
    options?: ActionData[];
    "copy-options"?: string;
    // fail?: string;
    "on-enter"?: InterStateData;
    "on-exit"?: InterStateData;
}

interface Desc {
    description: string;
    reqs?: Requirements;
}

export interface InterStateData {
    "unlock-flags"?: string[];
}

interface ActionData {
    action: string;
    state: string;
    reqs?: Requirements;
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
            theState.addOption(option.action, states.get(option.state)!, option.reqs)
        }
    }

    return true;
}