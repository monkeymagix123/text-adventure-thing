/**
 * Game variables class
 * Includes:
 * - Flags (session & non-session specific)
 * - Counters (increments on certain events)
 * - Values (named states, numbers, booleans, etc)
 */

import content from "$lib/content.json";

// const localStorage = window.localStorage;

class GameVars {
    // FLAGS
    /** All flags, including session flags */
    flags: Record<string, boolean> = {};
    /** List of session flags */
    tempFlags: Array<string> = [];
    
    // COUNTERS
    /** Number of times the game has been played (not including this round) */
    timesPlayed = 0;
    // const timesSolved = 0;
    // const timesFailed = 0;
    // const visitCount = 0;

    constructor() {this.init(); }

    init() {
        /** Set non-session flags to false */
        for (const flag of content.flags) {
            this.flags[flag] = false;
        }

        /** Set session flags to false and stores them as session flags */
        for (const flag of content.sessionFlags) {
            this.flags[flag] = false;
            this.tempFlags.push(flag);
        }
    }

    // UTILITY FUNCTIONS
    /** Sets flag to value */
    setFlag(flag: string, value: boolean) {
        this.flags[flag] = value;

        // maybe show something in achievements?
    }

    /** Checks if all flags in 'reqs' are true */
    hasAllFlags(reqs: string[]): boolean {
        return reqs.every((flag: string) => { return this.flags[flag] });
    }

    /** Checks if all flags in 'reqs' are false */
    hasNoFlags(reqs: string[]): boolean {
        return reqs.every((flag: string) => { return !this.flags[flag] });
    }

    /**
     * Resets certain flags to false.
     * @param tempOnly If true, resets only session flags.  
     * Otherwise, resets all flags.
     */
    resetFlags(tempOnly: boolean = true) {
        for (const flag of Object.keys(this.flags)) {
            if (!tempOnly || this.tempFlags.includes(flag)) {
                this.flags[flag] = false;
            }
        }
    }
}

export const gameVars = new GameVars();