import { loadOption, State } from "./state";
import content from "./content.json";
// import { source } from "./config";

// import content from "$lib/content-1.json";

import { SvelteMap } from "svelte/reactivity";
import { initPuzzles, linkPuzzles } from "./puzzles";

const states: Map<string, State> = new SvelteMap<string, State>();

// populate states with basic stuff
for (const state of content.states) {
    states.set(state.id, new State(state.title, state.description));
}

export const home = states.get("home")!;

initPuzzles(home, states);

// add in options
for (const state of content.states) {
    loadOption(states, state);
}

linkPuzzles(home, states);

let state = $state(home);

export function getState(): State {
    return state;
}

export function setState(newState: State) {
    state = newState;
}