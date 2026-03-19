/**
 * Define a small interface every puzzle module follows.
 */

import type { State } from "$lib/state";

export interface PuzzleModule<TPuzzle> {
    id: string;
    init(puzzle: TPuzzle, home: State, states: Map<string, State>): void;
    link(puzzle: TPuzzle, home: State, states: Map<string, State>): void;
}