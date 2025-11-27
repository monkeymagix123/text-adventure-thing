import { State } from "./state";

const home = new State("Home", "Welcome to the game");
const start = new State("[Background]", "Start the game");
home.addOption("Play", start);

start.addOption("[a]", start);

let state = $state(home);

export function getState(): State {
    return state;
}

export function setState(newState: State) {
    state = newState;
}