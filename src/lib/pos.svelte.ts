import { State } from "./state";
import content from "./content.json";

import { SvelteMap } from "svelte/reactivity";

const states: Map<string, State> = new SvelteMap<string, State>();

// populate states with basic stuff
for (const state of content.states) {
    states.set(state.id, new State(state.title, state.description));
}

// add in options
for (const state of content.states) {
    const theState = states.get(state.id)!;

    if (state["copy-options"] !== undefined) {
        theState.copyOptions(states.get(state["copy-options"])!);
    } else {
        for (const option of state.options) {
            theState.addOption(option.action, states.get(option.state)!)
        }
    }
    
}

export const home = states.get("home")!;

let state = $state(home);

export function getState(): State {
    return state;
}

export function setState(newState: State) {
    state = newState;
}