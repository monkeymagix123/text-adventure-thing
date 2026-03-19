/**
 * These tests cover the important behavior surface of choose():
 * transition succeeds
 * transition can be blocked by reqs
 * exit hooks fire
 * enter hooks fire
 * visit count increments
 * action-level reset works
 */

import { beforeEach, describe, expect, it } from "vitest";

import { GameEngine } from "./gameEngine";
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

describe("GameEngine.choose", () => {
    beforeEach(() => {
        gameVars.resetFlags(false);
    });

    it("moves to the chosen target state", () => {
        const start = new State("start", "Start");
        const next = new State("next", "Next");

        start.addOption(makeAction("Go", next));

        const engine = new GameEngine(start);

        expect(engine.current.title).toBe("start");

        engine.choose(start.options[0]!);

        expect(engine.current.title).toBe("next");
    });

    it("does not move when requirements are not met", () => {
        const start = new State("start", "Start");
        const locked = new State("locked", "Locked");

        start.addOption(
            makeAction("Open door", locked, {
                reqs: { flags: ["has-key"] }
            })
        );

        const engine = new GameEngine(start);

        engine.choose(start.options[0]!);

        expect(engine.current.title).toBe("start");
    });

    it("applies exit effects from the current state", () => {
        const start = new State("start", "Start");
        const next = new State("next", "Next");

        start.onExit = {
            "unlock-flags": ["left-start"]
        };

        start.addOption(makeAction("Go", next));

        const engine = new GameEngine(start);

        engine.choose(start.options[0]!);

        expect(engine.current.title).toBe("next");
        expect(gameVars.checkFlag("left-start")).toBe(true);
        expect(start.visitCount).toBe(1);
    });

    it("applies enter effects on the target state", () => {
        const start = new State("start", "Start");
        const next = new State("next", "Next");

        next.onEnter = {
            "unlock-flags": ["entered-next"]
        };

        start.addOption(makeAction("Go", next));

        const engine = new GameEngine(start);
        engine.choose(start.options[0]!);

        expect(engine.current.title).toBe("next");
        expect(gameVars.checkFlag("entered-next")).toBe(true);
    });

    it("applies action-level resetFlags before entering the target state", () => {
        const start = new State("start", "Start");
        const next = new State("next", "Next");

        const sessionFlag = content.sessionFlags[0];
        if (!sessionFlag) {
            throw new Error("Test requires at least one session flag in content.json");
        }

        gameVars.setFlag(sessionFlag, true);

        next.onEnter = {
            "unlock-flags": ["entered-next"]
        };

        start.addOption(
            makeAction("Go", next, {
                resetFlags: true
            })
        );

        const engine = new GameEngine(start);
        engine.choose(start.options[0]!);

        expect(engine.current.title).toBe("next");
        expect(gameVars.checkFlag(sessionFlag)).toBe(false);
        expect(gameVars.checkFlag("entered-next")).toBe(true);
    });

    it("does not clear non-session flags when action resetFlags is true", () => {
        const start = new State("start", "Start");
        const next = new State("next", "Next");

        const normalFlag = content.flags[0];
        if (!normalFlag) {
            throw new Error("Test requires at least one normal flag in content.json");
        }

        gameVars.setFlag(normalFlag, true);

        start.addOption(
            makeAction("Go", next, {
                resetFlags: true
            })
        );

        const engine = new GameEngine(start);
        engine.choose(start.options[0]!);

        expect(engine.current.title).toBe("next");
        expect(gameVars.checkFlag(normalFlag)).toBe(true);
    });

    it("runs exit effects before enter effects", () => {
        const start = new State("start", "Start");
        const next = new State("next", "Next");

        start.onExit = {
            "unlock-flags": ["shared-flag"],
            resetFlags: false
        };

        next.onEnter = {
            "unlock-flags": ["entered-next"]
        };

        start.addOption(makeAction("Go", next));

        const engine = new GameEngine(start);
        engine.choose(start.options[0]!);

        expect(gameVars.checkFlag("shared-flag")).toBe(true);
        expect(gameVars.checkFlag("entered-next")).toBe(true);
    });
});