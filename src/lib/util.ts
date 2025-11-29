import { hasAllFlags, hasNoFlags } from "./flags";
import type { State } from "./state";

export interface Requirements {
    flags?: string[];
    "no-flags"?: string[];
    "visit-count"?: number;
}

export const util = {
    checkReqs(state: State, reqs?: Requirements): boolean {
        if (!reqs) return true;

        const flagsEnough = !reqs.flags || hasAllFlags(reqs.flags);
        const noBadFlags = !reqs["no-flags"] || hasNoFlags(reqs["no-flags"]);
        const visitEnough = !reqs["visit-count"] || state.visitCount >= reqs["visit-count"];

        return (flagsEnough && noBadFlags && visitEnough);
    }
}