/**
 * Put shared stage-template logic here so
 * runtime and validation can use the same rules.
 */

export function expandStageIds(
    templateId: string,
    startNum: number,
    endNum: number
): string[] {
    if (!templateId.includes("[#]")) {
        throw new Error(`Stage template id "${templateId}" must include "[#]".`);
    }

    const ids: string[] = [];

    for (let i = startNum; i <= endNum; i++) {
        ids.push(templateId.replace("[#]", i.toString()));
    }

    return ids;
}

export function fillStageTemplate(template: string, n: number): string {
    return template.replaceAll("[#]", n.toString());
}