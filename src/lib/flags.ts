import content from "$lib/content.json";

// const localStorage = window.localStorage;

const flags: Record<string, boolean> = {};

for (const flag of content.flags) {
    flags[flag] = false;
}

export default flags;

export function setFlag(flag: string, value: boolean) {
    flags[flag] = value;

    // maybe show something in achievements?
}

export function hasAllFlags(reqs: string[]): boolean {
    return reqs.every((flag: string) => { return flags[flag] });
}