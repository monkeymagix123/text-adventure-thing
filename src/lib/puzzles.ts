import type { State } from "./state";
import type { PuzzleModule } from "./puzzles/registry";
import { primePuzzle } from "./puzzles/primePuzzle";

const puzzleModules: PuzzleModule[] = [
    primePuzzle
];

/**
 * Initialize all puzzle modules.
 * This should be called once, at the start of the game, to set up all the puzzle state graphs.
 * @param home The home state
 * @param states The map of states to initialize
 */
export function initPuzzles(home: State, states: Map<string, State>): void {
    for (const puzzle of puzzleModules) {
        puzzle.init(home, states);
    }
}

export function linkPuzzles(home: State, states: Map<string, State>): void {
    for (const puzzle of puzzleModules) {
        puzzle.link(home, states);
    }
}