/**
 * Save and load test
 * This gives you the important guarantees:
 *  current state comes back
 *  flags come back
 *  visit counts come back
 *  broken saves fail loudly
 */

import { beforeEach, describe, expect, it } from "vitest";

import { GameEngine, type SaveData } from "./gameEngine";
import { State, type Action } from "./state";
import { gameVars } from "./gameVars";
import content from "./content.json";

function makeAction(
    action: string,
    target: State,
    extra: Partial<Action> = {}
): Action {
    return {
        action,
        target,
        ...extra
    };
}

function makeEngine() {
    const start = new State("start", "Start");
    const next = new State("next", "Next");
    const end = new State("end", "End");

    const states = new Map<string, State>([
        ["start", start],
        ["next", next],
        ["end", end]
    ]);

    start.addOption(makeAction("Go next", next));
    next.addOption(makeAction("Go end", end));

    return {
        engine: new GameEngine(start, states),
        states,
        start,
        next,
        end
    };
}

describe("GameEngine save/load", () => {
    beforeEach(() => {
        gameVars.resetFlags(false);
    });

    it("restores current state, flags, and visit counts", () => {
        const { engine, start, next } = makeEngine();

        const sessionFlag = content.sessionFlags[0];
        const normalFlag = content.flags[0];

        if (!sessionFlag || !normalFlag) {
            throw new Error("Test requires at least one flag and one session flag in content.json");
        }

        gameVars.setFlag(sessionFlag, true);
        gameVars.setFlag(normalFlag, true);

        engine.choose(start.options[0]!);

        expect(engine.current.title).toBe("next");
        expect(start.visitCount).toBe(1);

        const save = engine.getSaveData();

        gameVars.setFlag(sessionFlag, false);
        gameVars.setFlag(normalFlag, false);
        next.visitCount = 99;
        engine.jumpTo(start);

        expect(engine.current.title).toBe("start");
        expect(gameVars.checkFlag(sessionFlag)).toBe(false);
        expect(gameVars.checkFlag(normalFlag)).toBe(false);
        expect(next.visitCount).toBe(99);

        engine.loadSaveData(save);

        expect(engine.current.title).toBe("next");
        expect(gameVars.checkFlag(sessionFlag)).toBe(true);
        expect(gameVars.checkFlag(normalFlag)).toBe(true);
        expect(start.visitCount).toBe(1);
        expect(next.visitCount).toBe(0);
    });

    it("throws if save references a missing state id", () => {
        const { engine } = makeEngine();

        const badSave: SaveData = {
            currentStateId: "missing-state",
            flags: {},
            visitCounts: {}
        };

        expect(() => engine.loadSaveData(badSave)).toThrow(/missing state/i);
    });
});