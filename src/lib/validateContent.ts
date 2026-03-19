import { ZodError } from "zod";
import { ContentDataSchema, type ContentDataValidated } from "./contentSchema";

function formatZodError(error: ZodError): string {
    return error.issues
        .map((issue) => {
            const path = issue.path.length > 0 ? issue.path.join(".") : "<root>";
            return `${path}: ${issue.message}`;
        })
        .join("\n");
}

export function validateContent(data: unknown, sourceName: string = "content"): ContentDataValidated {
    const result = ContentDataSchema.safeParse(data);

    if (!result.success) {
        const details = formatZodError(result.error);
        throw new Error(`Invalid ${sourceName}:\n${details}`);
    }

    return result.data;
}