import { loadOption, State } from "./state";
import contentData from "./content.json";
import { type ContentData } from "./contentData";

import { SvelteMap } from "svelte/reactivity";
import { initPuzzles, linkPuzzles } from "./puzzles";

const content = contentData as ContentData;

const states: Map<string, State> = new SvelteMap<string, State>();

function setup(): State {
    // populate states with basic, non-puzzle states
    for (const state of content.states) {
        states.set(state.id, new State(state));
    }
    
    // create home state as default
    const home = states.get("home")!;
    
    // create puzzle states
    initPuzzles(home, states);
    
    // add in options
    for (const state of content.states) {
        loadOption(states, state);
    }
    
    // link results of the puzzle actions to the states
    linkPuzzles(home, states);

    // return home state
    return home;
}

export const home = setup();

/** Current state player is in */
let state = $state(home);

export function getState(): State {
    return state;
}

export function setState(newState: State) {
    state = newState;

    newState.enterState();
}