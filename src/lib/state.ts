/**
 * State/action types and graph-linking helpers
 */

import type { Requirements } from "./util";

export class State {
    title: string;
    description: string;

    reqDesc?: Desc[];
    onEnter?: InterStateData;
    onExit?: InterStateData;

    /** Number of times this state has been exited. */
    visitCount = 0;

    options: Action[] = [];

    constructor(data: StateData | string, description?: string) {
        if (typeof data === "string") {
            this.title = data;
            this.description = description ?? "No description provided.";
            return;
        }

        this.title = data.title;
        this.description = data.description;
        this.reqDesc = data["req-descriptions"];
        this.onEnter = data["on-enter"];
        this.onExit = data["on-exit"];
    }

    addOption(option: Action): void {
        this.options.push(option);
    }

    copyOptions(other: State): void {
        this.options = [...other.options];
    }
}

export interface Action {
    action: string;
    target: State;
    reqs?: Requirements;
    resetFlags?: boolean;
}

export interface StateData {
    id: string;
    isStage?: boolean;
    title: string;
    description: string;
    "req-descriptions"?: Desc[];
    options?: ActionData[];
    "copy-options"?: string;
    "on-enter"?: InterStateData;
    "on-exit"?: InterStateData;
}

export interface Desc {
    description: string;
    reqs?: Requirements;
}

export interface InterStateData {
    "unlock-flags"?: string[];
    resetFlags?: boolean;
}

export interface ActionData {
    action: string;
    target: string;
    reqs?: Requirements;
    resetFlags?: boolean;
}

export function loadOption(states: Map<string, State>, data: StateData): boolean {
    const theState = states.get(data.id)!;

    if (data.isStage) {
        return false;
    }

    if (data["copy-options"] !== undefined) {
        theState.copyOptions(states.get(data["copy-options"])!);
        return true;
    }

    for (const option of data.options ?? []) {
        theState.addOption(convertOption(option, states));
    }

    return true;
}

export function convertOption(
    data: ActionData,
    states: Map<string, State>,
    replaceTarget?: State
): Action {
    const target =
        replaceTarget ?? states.get(data.target) ?? defaultState(states, data.target);

    return {
        action: data.action,
        target,
        reqs: data.reqs,
        resetFlags: data.resetFlags
    };
}

function defaultState(
    states: Map<string, State>,
    missingState: string = "fail",
    fallbackState: string = "start"
): State {
    console.warn(`Could not find desired state "${missingState}". Defaulting to "${fallbackState}".`);
    return states.get(fallbackState)!;
}