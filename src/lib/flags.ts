import content from "$lib/content.json";

// const localStorage = window.localStorage;

const flags: Record<string, boolean> = {};

for (const flag of content.flags) {
    flags[flag] = false;
}

export default flags;