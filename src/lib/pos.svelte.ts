import { State } from "./state";

const home = new State("Home", "Welcome to the game");
const start = new State(
    "Start",
    "You find yourself in a dark room. There's not quite anything to do at the moment, so you might as well explore."
);
home.addOption("Play", start);

const satDown = new State(
    "Sat Down",
    "You sit down, expecting to feel the cold floor beneath your feet. But instead, you find yourself in another dark room. There's not quite anything to do at the moment, so you might as well explore."
);
start.addOption("Explore", start);
start.addOption("Look around", start);
start.addOption("Sit down", satDown);
start.addOption("Exit game", home); // style this diff?

satDown.copyOptions(start);

let state = $state(home);

export function getState(): State {
    return state;
}

export function setState(newState: State) {
    state = newState;
}