import { z } from "zod";

export const RequirementsSchema = z
    .object({
        flags: z.array(z.string()).optional(),
        "no-flags": z.array(z.string()).optional(),
        "visit-count": z.number().int().nonnegative().optional()
    })
    .strict();

export const DescSchema = z
    .object({
        description: z.string(),
        reqs: RequirementsSchema.optional()
    })
    .strict();

export const InterStateDataSchema = z
    .object({
        "unlock-flags": z.array(z.string()).optional(),
        resetFlags: z.boolean().optional()
    })
    .strict();

export const ActionDataSchema = z
    .object({
        action: z.string(),
        target: z.string(),
        reqs: RequirementsSchema.optional(),
        resetFlags: z.boolean().optional()
    })
    .strict();

export const StateDataSchema = z
    .object({
        id: z.string().min(1),
        isStage: z.boolean().optional(),
        title: z.string(),
        description: z.string(),
        "req-descriptions": z.array(DescSchema).optional(),
        options: z.array(ActionDataSchema).optional(),
        "copy-options": z.string().optional(),
        "on-enter": InterStateDataSchema.optional(),
        "on-exit": InterStateDataSchema.optional()
    })
    .strict()
    .superRefine((state, ctx) => {
        const hasOptions = state.options !== undefined;
        const hasCopyOptions = state["copy-options"] !== undefined;

        if (hasOptions && hasCopyOptions) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'A state cannot have both "options" and "copy-options".'
            });
        }

        if (!state.isStage && !hasOptions && !hasCopyOptions) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'A non-stage state must have either "options" or "copy-options".'
            });
        }
    });

export const ContentDataSchema = z
    .object({
        /** Permanent progression flags. */
        flags: z.array(z.string()).optional(),
        /** Temporary/session progression flags. */
        sessionFlags: z.array(z.string()).optional(),
        states: z.array(StateDataSchema)
    })
    .strict();

export const PuzzleDefinitionSchema = z
    .object({
        name: z.string(),
        primeNums: z.array(z.number().int()),
        startNum: z.number().int(),
        endNum: z.number().int(),
        states: z.array(StateDataSchema),
        end: z.string(),
        fail: z.string()
    })
    .strict()
    .superRefine((puzzle, ctx) => {
        if (puzzle.startNum > puzzle.endNum) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: '"startNum" must be <= "endNum".'
            });
        }

        if (puzzle.primeNums.some((n) => n < puzzle.startNum || n > puzzle.endNum)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: '"primeNums" must all be between startNum and endNum.'
            });
        }
    });

export const PuzzleContentSchema = z
    .object({
        primes: PuzzleDefinitionSchema
    })
    .strict();

export type RequirementsData = z.infer<typeof RequirementsSchema>;
export type DescData = z.infer<typeof DescSchema>;
export type InterStateDataValidated = z.infer<typeof InterStateDataSchema>;
export type ActionDataValidated = z.infer<typeof ActionDataSchema>;
export type StateDataValidated = z.infer<typeof StateDataSchema>;
export type ContentDataValidated = z.infer<typeof ContentDataSchema>;
export type PuzzleDefinitionValidated = z.infer<typeof PuzzleDefinitionSchema>;
export type PuzzleContentValidated = z.infer<typeof PuzzleContentSchema>;