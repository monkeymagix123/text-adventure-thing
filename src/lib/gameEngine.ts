/**
 * Runtime gameplay rules
 */

import { gameVars } from "./gameVars";
import { util } from "./util";
import type { Action, State } from "./state";

export class GameEngine {
    current: State;
    readonly start: State;

    constructor(start: State) {
        this.start = start;
        this.current = start;

        this.applyEnter(start);
    }

    getDescription(): string {
        let desc = this.current.description;

        if (!this.current.reqDesc) {
            return desc;
        }

        for (const reqDesc of this.current.reqDesc) {
            // later entries override earlier ones if their reqs match
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
        this.current = this.start;
        this.applyEnter(this.current);
        return this.current;
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