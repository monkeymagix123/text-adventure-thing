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