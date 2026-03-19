/**
 * Define a small interface every puzzle module follows.
 */

import type { State } from "../state";

export interface PuzzleModule {
    id: string;
    init(home: State, states: Map<string, State>): void;
    link(home: State, states: Map<string, State>): void;
}