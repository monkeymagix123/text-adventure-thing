import { describe, expect, it } from "vitest";
import { State } from "../state";
import { primePuzzle, type PrimePuzzleData } from "./primePuzzle";

function makePuzzle(): PrimePuzzleData {
    return {
        name: "Primes",
        primeNums: [2, 3],
        startNum: 1,
        endNum: 3,
        end: "puzzle-end",
        fail: "puzzle-fail",
        states: [
            {
                id: "puzzle-start",
                title: "Start",
                description: "Start here",
                options: [
                    {
                        action: "Begin",
                        target: "puzzle-stage-[#]".replace("[#]", "1")
                    }
                ]
            },
            {
                id: "puzzle-stage-[#]",
                isStage: true,
                title: "Switch [#]",
                description: "At switch [#]",
                options: [
                    {
                        action: "Toggle",
                        target: "[toggle]"
                    },
                    {
                        action: "Move on",
                        target: "[next]"
                    }
                ]
            },
            {
                id: "puzzle-end",
                title: "Win",
                description: "You win",
                options: []
            },
            {
                id: "puzzle-fail",
                title: "Fail",
                description: "You fail",
                options: []
            }
        ]
    };
}

function setupStates() {
    const states = new Map<string, State>();
    const home = new State("home", "Home");
    states.set("home", home);
    return { states, home };
}

describe("primePuzzle", () => {
    it("creates concrete stage states during init", () => {
        const puzzle = makePuzzle();
        const { states, home } = setupStates();

        primePuzzle.init(puzzle, home, states);

        expect(states.has("puzzle-start")).toBe(true);
        expect(states.has("puzzle-stage-1")).toBe(true);
        expect(states.has("puzzle-stage-2")).toBe(true);
        expect(states.has("puzzle-stage-3")).toBe(true);
    });

    it("links stage choices correctly", () => {
        const puzzle = makePuzzle();
        const { states, home } = setupStates();

        primePuzzle.init(puzzle, home, states);
        primePuzzle.link(puzzle, home, states);

        const stage1 = states.get("puzzle-stage-1")!;
        const stage2 = states.get("puzzle-stage-2")!;

        const stage1Toggle = stage1.options.find((o) => o.action === "Toggle")!;
        const stage1MoveOn = stage1.options.find((o) => o.action === "Move on")!;

        const stage2Toggle = stage2.options.find((o) => o.action === "Toggle")!;
        const stage2MoveOn = stage2.options.find((o) => o.action === "Move on")!;

        // 1 is not prime -> Move on is correct
        expect(stage1MoveOn.target.title).toBe("Switch 2");
        expect(stage1Toggle.target.title).toBe("Fail");

        // 2 is prime -> Toggle is correct
        expect(stage2Toggle.target.title).toBe("Switch 3");
        expect(stage2MoveOn.target.title).toBe("Fail");
    });
});