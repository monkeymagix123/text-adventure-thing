import { setState } from "./pos.svelte";

export class State {
    title: string;   
    description: string;

    // url: string;

    options: Action[];

    constructor(title: string, description: string) {
        this.title = title;
        this.description = description;

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
    }

    copyOptions(other: State) {
        this.options = other.options;
    }
}

export interface Action {
    action: string;
    state: State;
}

interface StateData {
    id: string;
    isStage?: boolean;
    title: string;
    description: string;
    options?: ActionData[];
    "copy-options"?: string;
    // fail?: string;
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