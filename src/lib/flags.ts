import content from "$lib/content.json";

// const localStorage = window.localStorage;

// FLAGS
/** All flags, including session flags */
const flags: Record<string, boolean> = {};
/** List of session flags */
const tempFlags: Array<string> = [];

/** Set non-session flags to false */
for (const flag of content.flags) {
    flags[flag] = false;
}

/** Set session flags to false and stores them as session flags */
for (const flag of content.sessionFlags) {
    flags[flag] = false;
    tempFlags.push(flag);
}

export default flags;

/** Sets flag to value */
export function setFlag(flag: string, value: boolean) {
    flags[flag] = value;

    // maybe show something in achievements?
}

/** Checks if all flags in 'reqs' are true */
export function hasAllFlags(reqs: string[]): boolean {
    return reqs.every((flag: string) => { return flags[flag] });
}

/** Checks if all flags in 'reqs' are false */
export function hasNoFlags(reqs: string[]): boolean {
    return reqs.every((flag: string) => { return !flags[flag] });
}

/**
 * Resets certain flags to false.
 * @param tempOnly If true, resets only session flags.  
 * Otherwise, resets all flags.
 */
export function resetFlags(tempOnly: boolean = true) {
    for (const flag of Object.keys(flags)) {
        if (!tempOnly || tempFlags.includes(flag)) {
            flags[flag] = false;
        }
    }
}