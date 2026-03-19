import content from "$lib/content.json";

// const localStorage = window.localStorage;

const flags: Record<string, boolean> = {};
const tempFlags: Array<string> = [];

for (const flag of content.flags) {
    flags[flag] = false;
}

for (const flag of content.sessionFlags) {
    flags[flag] = false;
    tempFlags.push(flag);
}

export default flags;

export function setFlag(flag: string, value: boolean) {
    flags[flag] = value;

    // maybe show something in achievements?
}

export function hasAllFlags(reqs: string[]): boolean {
    return reqs.every((flag: string) => { return flags[flag] });
}

export function hasNoFlags(reqs: string[]): boolean {
    return reqs.every((flag: string) => { return !flags[flag] });
}

export function resetFlags(tempOnly: boolean = true) {
    for (const flag of Object.keys(flags)) {
        if (!tempOnly || tempFlags.includes(flag)) {
            flags[flag] = false;
        }
    }
}