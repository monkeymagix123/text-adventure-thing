/**
 * This file should do one job:
 * build and link the full state graph from your JSON content.
 */

import rawContentData from "./content.json";
import rawPuzzleData from "./puzzle-content.json";

import type {
    ContentDataValidated,
    PuzzleContentValidated
} from "./contentSchema";
import { validateContent } from "./validateContent";
import { validatePuzzleContent } from "./validatePuzzleContent";
import { validateAllContentSemantics } from "./validateContentSemantics";
import { initPuzzles, linkPuzzles } from "./puzzles";
import { loadOption, State } from "./state";

export interface LoadedContent {
    states: Map<string, State>;
    home: State;
    content: ContentDataValidated;
    puzzles: PuzzleContentValidated;
}

export function loadContent(rawData: unknown = rawContentData): LoadedContent {
    const content = validateContent(rawData, "content.json");
    const puzzles = validatePuzzleContent(rawPuzzleData, "puzzle-content.json");

    validateAllContentSemantics(content, puzzles);

    const states = new Map<string, State>();

    for (const state of content.states) {
        states.set(state.id, new State(state));
    }

    const home = states.get("home");
    if (!home) {
        throw new Error('Could not find required state "home" in content.json');
    }

    initPuzzles(home, states);

    // load main content options first
    for (const state of content.states) {
        loadOption(states, state);
    }

    // then let puzzles link, since they may depend on main states
    linkPuzzles(home, states);

    return { states, home, content, puzzles };
}