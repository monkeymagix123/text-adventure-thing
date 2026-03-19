/**
 * Receives validated puzzle content and passes it to each puzzle module
 */

import type { PuzzleContentValidated } from "./contentSchema";
import type { State } from "./state";
import { primePuzzle } from "$lib/puzzles/primePuzzle";

export function initPuzzles(
    puzzles: PuzzleContentValidated,
    home: State,
    states: Map<string, State>
): void {
    primePuzzle.init(puzzles.primes, home, states);
}

export function linkPuzzles(
    puzzles: PuzzleContentValidated,
    home: State,
    states: Map<string, State>
): void {
    primePuzzle.link(puzzles.primes, home, states);
}