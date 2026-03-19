/**
 * Live session/reactive wrapper for the UI
 */

import { GameEngine } from "./gameEngine";
import { loadContent } from "./contentLoader";
import type { Action, State } from "./state";

import { gameVars } from "./gameVars";

const { states, home } = loadContent();
const engine = new GameEngine(home, states);
const SAVE_KEY = "text-adventure-save";

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
    engine.jumpTo(home);
    syncState();
}

export function resetGame(): void {
    engine.reset();
    syncState();
}

export function saveGame(): void {
    const data = engine.getSaveData();
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

export function loadGame(): boolean {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
        return false;
    }

    const data = JSON.parse(raw);
    engine.loadSaveData(data);
    syncState();
    return true;
}

export function clearSave(): void {
    localStorage.removeItem(SAVE_KEY);
}

export function getAllStates(): Map<string, State> {
    return states;
}

// DEBUG
export function getCurrentStateId(): string {
    const state = getState();

    for (const [id, candidate] of states.entries()) {
        if (candidate === state) {
            return id;
        }
    }

    return "(unknown)";
}

export function getDebugFlags(): Record<string, boolean> {
    currentState;
    return gameVars.getAllFlags();
}

export function getDebugVisitCounts(): Record<string, number> {
    currentState;

    const counts: Record<string, number> = {};
    for (const [id, state] of states.entries()) {
        if (state.visitCount > 0) {
            counts[id] = state.visitCount;
        }
    }

    return counts;
}