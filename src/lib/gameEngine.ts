/**
 * Runtime gameplay rules
 */

import { gameVars } from "./gameVars";
import { util } from "./util";
import type { Action, State } from "./state";

export interface SaveData {
    currentStateId: string;
    flags: Record<string, boolean>;
    visitCounts: Record<string, number>;
}

export class GameEngine {
    current: State;
    readonly start: State;
    readonly states: Map<string, State>;

    constructor(start: State, states: Map<string, State>) {
        this.start = start;
        this.current = start;
        this.states = states;

        this.applyEnter(start);
    }

    getDescription(): string {
        let desc = this.current.description;

        if (!this.current.reqDesc) {
            return desc;
        }

        for (const reqDesc of this.current.reqDesc) {
            if (util.checkReqs(this.current, reqDesc.reqs)) {
                desc = reqDesc.description;
            }
        }

        return desc;
    }

    getOptions(): Action[] {
        return this.current.options.filter((option) =>
            util.checkReqs(this.current, option.reqs)
        );
    }

    canChoose(action: Action): boolean {
        return util.checkReqs(this.current, action.reqs);
    }

    choose(action: Action): State {
        if (!this.canChoose(action)) {
            return this.current;
        }

        this.applyExit(this.current);

        if (action.resetFlags) {
            gameVars.resetFlags();
        }

        this.current = action.target;
        this.applyEnter(this.current);

        return this.current;
    }

    goTo(state: State): State {
        this.applyExit(this.current);
        this.current = state;
        this.applyEnter(this.current);
        return this.current;
    }

    reset(): State {
        gameVars.resetFlags(false);
        this.resetVisitCounts();
        this.current = this.start;
        this.applyEnter(this.current);
        return this.current;
    }

    getSaveData(): SaveData {
        const visitCounts: Record<string, number> = {};

        for (const [id, state] of this.states.entries()) {
            visitCounts[id] = state.visitCount;
        }

        return {
            currentStateId: this.findStateId(this.current),
            flags: gameVars.getAllFlags(),
            visitCounts
        };
    }

    loadSaveData(data: SaveData): State {
        const target = this.states.get(data.currentStateId);
        if (!target) {
            throw new Error(`Invalid save: missing state "${data.currentStateId}".`);
        }

        gameVars.setAllFlags(data.flags);

        for (const state of this.states.values()) {
            state.visitCount = 0;
        }

        for (const [id, count] of Object.entries(data.visitCounts)) {
            const state = this.states.get(id);
            if (state) {
                state.visitCount = count;
            }
        }

        this.current = target;
        return this.current;
    }

    private findStateId(target: State): string {
        for (const [id, state] of this.states.entries()) {
            if (state === target) {
                return id;
            }
        }

        throw new Error(`Could not find state id for "${target.title}".`);
    }

    private resetVisitCounts(): void {
        for (const state of this.states.values()) {
            state.visitCount = 0;
        }
    }

    private applyEnter(state: State): void {
        const unlockFlags = state.onEnter?.["unlock-flags"] ?? [];

        for (const flag of unlockFlags) {
            gameVars.setFlag(flag, true);
        }

        if (state.onEnter?.resetFlags) {
            gameVars.resetFlags();
        }
    }

    private applyExit(state: State): void {
        state.visitCount++;

        const unlockFlags = state.onExit?.["unlock-flags"] ?? [];

        for (const flag of unlockFlags) {
            gameVars.setFlag(flag, true);
        }

        if (state.onExit?.resetFlags) {
            gameVars.resetFlags();
        }
    }
}