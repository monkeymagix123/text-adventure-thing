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
    /** List of session flags */
    static tempFlags: Array<string> = [];

    // FLAGS
    /** All flags, including session flags */
    flags: Record<string, boolean> = {};
    
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
            GameVars.tempFlags.push(flag);
        }
    }

    // UTILITY FUNCTIONS
    // FLAGS
    /** Sets flag to value */
    setFlag(flag: string, value: boolean) {
        this.flags[flag] = value;

        // maybe show something in achievements?
    }

    /** Checks if flag is true */
    checkFlag(flag: string): boolean { return this.flags[flag]; }

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
            if (!tempOnly || GameVars.tempFlags.includes(flag)) {
                this.flags[flag] = false;
            }
        }
    }

    /** Returns a shallow copy of all flags for save data */
    getAllFlags(): Record<string, boolean> {
        return { ...this.flags };
    }

    /** Replaces all flag values from save data */
    setAllFlags(flags: Record<string, boolean>): void {
        // Reset known flags first
        for (const key of Object.keys(this.flags)) {
            this.flags[key] = false;
        }

        // Restore saved values, but only for known flags
        for (const [key, value] of Object.entries(flags)) {
            if (key in this.flags) {
                this.flags[key] = value;
            }
        }
    }

    // VALUES
}

export const gameVars = new GameVars();