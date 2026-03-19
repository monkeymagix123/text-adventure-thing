/**
 * This file should do one job:
 * build and link the full state graph from your JSON content.
 */

import { SvelteMap } from "svelte/reactivity";

import contentData from "./content.json";
import type { ContentData } from "./contentData";
import { initPuzzles, linkPuzzles } from "./puzzles";
import { loadOption, State } from "./state";

export interface LoadedContent {
    states: Map<string, State>;
    home: State;
}

export function loadContent(): LoadedContent {
    const content = contentData as ContentData;
    const states: Map<string, State> = new SvelteMap<string, State>();

    // 1. Create all normal states first
    for (const state of content.states) {
        states.set(state.id, new State(state));
    }

    // 2. Resolve the home/start state
    const home = states.get("home");
    if (!home) {
        throw new Error('Could not find required state "home" in content.json');
    }

    // 3. Let puzzles create any generated states
    initPuzzles(home, states);

    // 4. Link normal content options
    for (const state of content.states) {
        loadOption(states, state);
    }

    // 5. Let puzzles link their custom transitions
    linkPuzzles(home, states);

    return { states, home };
}