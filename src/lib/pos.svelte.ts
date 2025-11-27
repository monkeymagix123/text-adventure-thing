import { State } from "./state";

import content from "./content.json";

const home = new State(content.states[0].title, content.states[0].description);
const start = new State(content.states[1].title, content.states[1].description);
home.addOption("Play", start);

const satDown = new State(content.states[2].title, content.states[2].description);
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