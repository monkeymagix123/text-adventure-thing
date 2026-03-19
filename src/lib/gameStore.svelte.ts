/**
 * Live session/reactive wrapper for the UI
 */

import { GameEngine } from "./gameEngine";
import { loadContent } from "./contentLoader";
import type { Action, State } from "./state";

const { states, home } = loadContent();
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