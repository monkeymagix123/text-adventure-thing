import { SvelteMap } from "svelte/reactivity";

import contentData from "./content.json";
import type { ContentData } from "./contentData";
import { GameEngine } from "./gameEngine";
import { initPuzzles, linkPuzzles } from "./puzzles";
import { loadOption, State, type Action } from "./state";

const content = contentData as ContentData;
const states: Map<string, State> = new SvelteMap<string, State>();

function setupStates(): State {
    for (const state of content.states) {
        states.set(state.id, new State(state));
    }

    const home = states.get("home")!;

    initPuzzles(home, states);

    for (const state of content.states) {
        loadOption(states, state);
    }

    linkPuzzles(home, states);

    return home;
}

export const home = setupStates();
const engine = new GameEngine(home);

let currentState = $state(engine.current);

function syncState(): void {
    currentState = engine.current;
}

export function getState(): State {
    return currentState;
}

export function getDescription(): string {
    currentState;
    return engine.getDescription();
}

export function getOptions(): Action[] {
    currentState;
    return engine.getOptions();
}

export function choose(action: Action): void {
    engine.choose(action);
    syncState();
}

export function goHome(): void {
    engine.goTo(home);
    syncState();
}

export function resetGame(): void {
    engine.reset();
    syncState();
}

export function getAllStates(): Map<string, State> {
    return states;
}