import { State } from "./state";
import puzzles from "$lib/puzzle-content.json";

const puzzleStates = new Map<string, State>();

export function initPuzzles(home: State): Map<string, State> {
    initPrimePuzzle(home);

    return puzzleStates;
}

function initPrimePuzzle(home: State): void {
    const primesData = puzzles.primes;
    const primeNums = puzzles.primes.primeNums;

    const startNum = puzzles.primes.startNum;
    const endNum = puzzles.primes.endNum;

    // maybe puzzle where toggle prime #s 1-16, reward is smth used in an upgrade?
    // euclid elements maybe as a hint


    // initialize the title and descriptions
    const start = new State(primesData.start.title, primesData.start.description);
    puzzleStates.set("puzzle-prime-start", start);

    for (let i = startNum; i <= endNum; i++) {
        const title = primesData.stage.title.replace("[#]", i.toString());
        const description = primesData.stage.description.replace("[#]", i.toString());

        const state = new State(title, description);

        puzzleStates.set(`puzzle-prime-${i}`, state);
    }

    const end = new State(primesData.end.title, primesData.end.description);
    puzzleStates.set("puzzle-prime-end", end);

    const fail = new State(primesData.fail.title, primesData.fail.description);
    puzzleStates.set("puzzle-prime-fail", fail);

    // link the states
    start.addOption(primesData.start.options[0].action, puzzleStates.get("puzzle-prime-1")!);

    for (let i = startNum; i < endNum; i++) {
        // get current state
        const state = puzzleStates.get(`puzzle-prime-${i}`)!;

        // toggle if prime, don't toggle if not
        const goodAction = primeNums.includes(i) ? primesData.stage.options[0].action : primesData.stage.options[1].action;
        const badAction = primeNums.includes(i) ? primesData.stage.options[1].action : primesData.stage.options[0].action;

        // link the options
        state.addOption(goodAction, puzzleStates.get(`puzzle-prime-${i + 1}`)!);
        state.addOption(badAction, fail);
    }

    const i = endNum;
    const state = puzzleStates.get(`puzzle-prime-${i}`)!;

    // toggle if prime, don't toggle if not
    const goodAction = primeNums.includes(i) ? primesData.stage.options[0].action : primesData.stage.options[1].action;
    const badAction = primeNums.includes(i) ? primesData.stage.options[1].action : primesData.stage.options[0].action;

    // link the options
    state.addOption(goodAction, end);
    state.addOption(badAction, fail);


    // add fail option that restarts
    fail.addOption(primesData.fail.options[0].action, home);

    // home.copyOptions(puzzleStates.get("prime-1")!);
}