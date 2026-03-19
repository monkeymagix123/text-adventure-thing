/**
 * This moves the current prime-specific logic out of the central puzzle file.
 * Uses validated puzzle shape.
 */

import { State, convertOption, loadOption } from "$lib/state";
import type {
    ActionDataValidated as ActionData,
    PuzzleContentValidated,
    StateDataValidated as StateData
} from "$lib/contentSchema";
import { fillStageTemplate } from "./helpers";
import type { PuzzleModule } from "./registry";

export type PrimePuzzleData = PuzzleContentValidated["primes"];

function getStageTemplate(puzzle: PrimePuzzleData): StateData {
    const template = puzzle.states.find((state) => state.isStage);
    if (!template) {
        throw new Error('Prime puzzle is missing required stage template state.');
    }
    return template;
}

function getNonStageStates(puzzle: PrimePuzzleData): StateData[] {
    return puzzle.states.filter((state) => !state.isStage);
}

function isSpecialTarget(option: ActionData, specialTarget: string): boolean {
    return option.target === specialTarget;
}

export const primePuzzle: PuzzleModule<PrimePuzzleData> = {
    id: "primes",

    init(puzzle, _home, states): void {
        const template = getStageTemplate(puzzle);

        for (const state of getNonStageStates(puzzle)) {
            states.set(state.id, new State(state));
        }

        for (let i = puzzle.startNum; i <= puzzle.endNum; i++) {
            const sid = fillStageTemplate(template.id, i);
            const stitle = fillStageTemplate(template.title, i);
            const sdescription = fillStageTemplate(template.description, i);

            states.set(sid, new State(stitle, sdescription));
        }
    },

    link(puzzle, _home, states): void {
        const template = getStageTemplate(puzzle);

        for (const state of getNonStageStates(puzzle)) {
            loadOption(states, state);
        }

        for (let i = puzzle.startNum; i <= puzzle.endNum; i++) {
            const sid = fillStageTemplate(template.id, i);
            const current = states.get(sid);

            if (!current) {
                throw new Error(`Missing generated prime puzzle state "${sid}".`);
            }

            const nextTarget =
                i >= puzzle.endNum
                    ? puzzle.end
                    : fillStageTemplate(template.id, i + 1);

            const isPrime = puzzle.primeNums.includes(i);

            for (const option of template.options ?? []) {
                if (isSpecialTarget(option, "[toggle]") || isSpecialTarget(option, "[next]")) {
                    const playerChoseToggle = isSpecialTarget(option, "[toggle]");
                    const isCorrect = playerChoseToggle === isPrime;

                    current.addOption(
                        convertOption(
                            {
                                ...option,
                                target: isCorrect ? nextTarget : puzzle.fail
                            },
                            states
                        )
                    );
                    continue;
                }

                current.addOption(convertOption(option, states));
            }
        }
    }
};