import { gameVars } from "./gameVars";
import type { State } from "./state";

export interface Requirements {
    flags?: string[];
    "no-flags"?: string[];
    "visit-count"?: number;
}

export const util = {
    checkReqs(state: State, reqs?: Requirements): boolean {
        if (!reqs) return true;

        const flagsEnough = !reqs.flags || gameVars.hasAllFlags(reqs.flags);
        const noBadFlags = !reqs["no-flags"] || gameVars.hasNoFlags(reqs["no-flags"]);
        const visitEnough = !reqs["visit-count"] || state.visitCount >= reqs["visit-count"];

        return (flagsEnough && noBadFlags && visitEnough);
    }
}