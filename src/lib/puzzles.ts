import { State } from "./state";
import puzzles from "$lib/puzzle-content.json";

export function initPuzzles(home: State, states: Map<string, State>): void {
    initPrimePuzzle(home, states);
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
    const primeNums = puzzles.primes.primeNums;

    const startNum = puzzles.primes.startNum;
    const endNum = puzzles.primes.endNum;

    // maybe puzzle where toggle prime #s 1-16, reward is smth used in an upgrade?
    // euclid elements maybe as a hint


    // initialize the title and descriptions
    const start = new State(primesData.start.title, primesData.start.description);
    states.set("puzzle-prime-start", start);

    for (let i = startNum; i <= endNum; i++) {
        const title = primesData.stage.title.replace("[#]", i.toString());
        const description = primesData.stage.description.replace("[#]", i.toString());

        const state = new State(title, description);

        states.set(`puzzle-prime-${i}`, state);
    }

    const end = new State(primesData.end.title, primesData.end.description);
    states.set("puzzle-prime-end", end);

    const fail = new State(primesData.fail.title, primesData.fail.description);
    states.set("puzzle-prime-fail", fail);

    // link the states
    start.addOption(primesData.start.options[0].action, states.get("puzzle-prime-1")!);

    for (let i = startNum; i < endNum; i++) {
        // get current state
        const state = states.get(`puzzle-prime-${i}`)!;

        // toggle if prime, don't toggle if not
        const isToggle = primeNums.includes(i);

        for (const option of primesData.stage.options) {
            const isCorrect = (isToggle === (option.state === "toggle"));

            // link option result
            state.addOption(option.action, isCorrect ? states.get(`puzzle-prime-${i + 1}`)! : fail);
        }
    }

    const i = endNum;
    const state = states.get(`puzzle-prime-${i}`)!;

    // toggle if prime, don't toggle if not
    const isToggle = primeNums.includes(i);

    for (const option of primesData.stage.options) {
        const isCorrect = (isToggle === (option.state === "toggle"));

        // link option result
        state.addOption(option.action, isCorrect ? end : fail);
    }


    // add fail option that restarts
    fail.addOption(primesData.fail.options[0].action, home);

    // add end option
    const endCopyOptions = primesData.end["copy-options"];
    if (endCopyOptions !== undefined) {
        end.copyOptions(states.get(endCopyOptions)!);
    }

    // home.copyOptions(puzzleStates.get("prime-1")!);
}