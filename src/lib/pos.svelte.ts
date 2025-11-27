import { State } from "./state";

const home = new State("Home", "Welcome to the game");
const start = new State("Start", "You find yourself in a dark room. There's not quite anything to do at the moment, so you might as well explore.");
home.addOption("Play", start);

start.addOption("Explore", start);
start.addOption("Look around", start);
start.addOption("Sit down", start);
start.addOption("Exit game", home); // style this diff?

let state = $state(home);

export function getState(): State {
    return state;
}

export function setState(newState: State) {
    state = newState;
}