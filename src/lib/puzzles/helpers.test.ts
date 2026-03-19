import { describe, expect, it } from "vitest";
import { expandStageIds, fillStageTemplate } from "./helpers";

describe("helpers", () => {
    it("fills a stage template", () => {
        expect(fillStageTemplate("puzzle-stage-[#]", 3)).toBe("puzzle-stage-3");
        expect(fillStageTemplate("Switch [#]", 12)).toBe("Switch 12");
    });

    it("expands stage ids across a range", () => {
        expect(expandStageIds("puzzle-stage-[#]", 1, 3)).toEqual([
            "puzzle-stage-1",
            "puzzle-stage-2",
            "puzzle-stage-3"
        ]);
    });

    it('throws if template id is missing "[#]"', () => {
        expect(() => expandStageIds("puzzle-stage", 1, 3)).toThrow(
            'must include "[#]"'
        );
    });
});