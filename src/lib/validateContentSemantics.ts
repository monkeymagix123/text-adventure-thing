import type {
    ContentDataValidated,
    PuzzleContentValidated,
    PuzzleDefinitionValidated,
    StateDataValidated
} from "./contentSchema";

const SPECIAL_TARGETS = new Set([
    "[toggle]",
    "[next]"
]);

export function validateAllContentSemantics(
    mainContent: ContentDataValidated,
    puzzleContent: PuzzleContentValidated
): void {
    const allFlagIds = new Set([
        ...(mainContent.flags ?? []),
        ...(mainContent.sessionFlags ?? [])
    ]);

    const allStateIds = new Set<string>();

    for (const state of mainContent.states) {
        addUniqueStateId(allStateIds, state.id, "content.json");
    }

    for (const [puzzleName, puzzle] of Object.entries(puzzleContent)) {
        addPuzzleStateIds(allStateIds, puzzle, puzzleName);
    }

    if (!allStateIds.has("home")) {
        throw new Error('Invalid content: missing required state "home".');
    }

    for (const state of mainContent.states) {
        validateState(state, allStateIds, allFlagIds, "content.json");
    }

    for (const [puzzleName, puzzle] of Object.entries(puzzleContent)) {
        if (!allStateIds.has(puzzle.end)) {
            throw new Error(
                `Invalid puzzle-content.json: puzzle "${puzzleName}" has missing end state "${puzzle.end}".`
            );
        }

        if (!allStateIds.has(puzzle.fail)) {
            throw new Error(
                `Invalid puzzle-content.json: puzzle "${puzzleName}" has missing fail state "${puzzle.fail}".`
            );
        }

        for (const state of puzzle.states) {
            validateState(
                state,
                allStateIds,
                allFlagIds,
                `puzzle-content.json (${puzzleName})`
            );
        }
    }
}

function addPuzzleStateIds(
    ids: Set<string>,
    puzzle: PuzzleDefinitionValidated,
    puzzleName: string
): void {
    for (const state of puzzle.states) {
        if (!state.isStage) {
            addUniqueStateId(ids, state.id, `puzzle-content.json (${puzzleName})`);
            continue;
        }

        for (const generatedId of expandStageIds(state.id, puzzle.startNum, puzzle.endNum)) {
            addUniqueStateId(ids, generatedId, `puzzle-content.json (${puzzleName})`);
        }
    }
}

function expandStageIds(templateId: string, startNum: number, endNum: number): string[] {
    if (!templateId.includes("[#]")) {
        throw new Error(
            `Invalid puzzle-content.json: stage template id "${templateId}" must include "[#]".`
        );
    }

    const ids: string[] = [];

    for (let i = startNum; i <= endNum; i++) {
        ids.push(templateId.replace("[#]", i.toString()));
    }

    return ids;
}

function addUniqueStateId(
    ids: Set<string>,
    id: string,
    sourceName: string
): void {
    if (ids.has(id)) {
        throw new Error(`Invalid ${sourceName}: duplicate state id "${id}".`);
    }

    ids.add(id);
}

function validateState(
    state: StateDataValidated,
    allStateIds: Set<string>,
    allFlagIds: Set<string>,
    sourceName: string
): void {
    for (const desc of state["req-descriptions"] ?? []) {
        validateRequirementRefs(
            desc.reqs,
            allFlagIds,
            sourceName,
            state.id,
            "req-descriptions"
        );
    }

    validateInterStateRefs(state["on-enter"], allFlagIds, sourceName, state.id, "on-enter");
    validateInterStateRefs(state["on-exit"], allFlagIds, sourceName, state.id, "on-exit");

    if (state["copy-options"] && !allStateIds.has(state["copy-options"])) {
        throw new Error(
            `Invalid ${sourceName}: state "${state.id}" copies options from missing state "${state["copy-options"]}".`
        );
    }

    for (const option of state.options ?? []) {
        validateRequirementRefs(
            option.reqs,
            allFlagIds,
            sourceName,
            state.id,
            `option "${option.action}"`
        );

        if (!SPECIAL_TARGETS.has(option.target) && !allStateIds.has(option.target)) {
            throw new Error(
                `Invalid ${sourceName}: state "${state.id}" has option "${option.action}" pointing to missing target "${option.target}".`
            );
        }
    }
}

function validateRequirementRefs(
    reqs: { flags?: string[]; "no-flags"?: string[] } | undefined,
    allFlagIds: Set<string>,
    sourceName: string,
    stateId: string,
    context: string
): void {
    if (!reqs) return;

    for (const flag of reqs.flags ?? []) {
        if (!allFlagIds.has(flag)) {
            throw new Error(
                `Invalid ${sourceName}: state "${stateId}" references unknown flag "${flag}" in ${context}.`
            );
        }
    }

    for (const flag of reqs["no-flags"] ?? []) {
        if (!allFlagIds.has(flag)) {
            throw new Error(
                `Invalid ${sourceName}: state "${stateId}" references unknown flag "${flag}" in ${context}.`
            );
        }
    }
}

function validateInterStateRefs(
    data: { "unlock-flags"?: string[] } | undefined,
    allFlagIds: Set<string>,
    sourceName: string,
    stateId: string,
    context: string
): void {
    if (!data) return;

    for (const flag of data["unlock-flags"] ?? []) {
        if (!allFlagIds.has(flag)) {
            throw new Error(
                `Invalid ${sourceName}: state "${stateId}" references unknown flag "${flag}" in ${context}.`
            );
        }
    }
}