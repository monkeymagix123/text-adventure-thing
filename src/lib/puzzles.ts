import { convertOption, loadOption, State, type StateData } from "./state";
import puzzles from "$lib/puzzle-content.json";

export function initPuzzles(home: State, states: Map<string, State>): void {
    initPrimePuzzle(home, states);
}

export function linkPuzzles(home: State, states: Map<string, State>): void {
    linkPrimePuzzle(home, states);
}

/**
 * Initializes the Prime Puzzle, which is a puzzle where the player must toggle the switches corresponding with prime numbers.
 * The puzzle starts with a state where the player must make a choice, and ends with a state where the player is rewarded or penalized based on their choice.
 * The states in the puzzle are linked together such that the player can progress through the puzzle by making choices.
 * The puzzle is designed to be used in an upgrade, where the player is rewarded with an upgrade if they complete the puzzle correctly.
 * The puzzle uses the Euclid elements as a hint to help the player solve it.
 * @param home The starting state of the game.
 * @param states The map of all created non-puzzle states.
 */
function initPrimePuzzle(home: State, states: Map<string, State>): void {
    const primesData = puzzles.primes;

    const startNum = primesData.startNum;
    const endNum = primesData.endNum;

    // maybe puzzle where toggle prime #s 1-16, reward is smth used in an upgrade?
    // euclid elements maybe as a hint

    // initialize all states
    for (const state of primesData.states) {
        const id = state.id;
        const title = state.title;
        const description = state.description;

        const cstate = state as StateData;

        if (!cstate.isStage) {
            states.set(id, new State(cstate));
            continue;
        }

        // create from start to end
        for (let i = startNum; i <= endNum; i++) {
            const sid = id.replace("[#]", i.toString());
            const stitle = title.replace("[#]", i.toString());
            const sdescription = description.replace("[#]", i.toString());

            states.set(sid, new State(stitle, sdescription));
        }
    }
}

function linkPrimePuzzle(home: State, states: Map<string, State>) {
    const primesData = puzzles.primes;

    const primeNums = primesData.primeNums;
    const startNum = primesData.startNum;
    const endNum = primesData.endNum;

    const failState = states.get(primesData.fail)!;

    const endStr = primesData.end;

    for (const state of primesData.states) {
        if (!state.isStage) {
            loadOption(states, state);
            
            continue;
        }
        
        // for stage ones, need to handle it specially with loop over #s
        for (let i = startNum; i <= endNum; i++) {
            // Get current state & next state
            const id = state.id.replace("[#]", i.toString());
            const theState = states.get(id)!;

            const nextId = state.id.replace("[#]", (i + 1).toString());
            const nextStateStr = (i === endNum) ? endStr : nextId;
            const nextState = states.get(nextStateStr)!;

            // toggle if prime, don't toggle if not
            const isToggle = primeNums.includes(i);

            for (const option of state.options) {
                const isCorrect = (isToggle === (option.state === "[toggle]"));

                const resultState = isCorrect ? nextState : failState;

                theState.addOption(convertOption(option, states, resultState));
            }
        }
    }
}