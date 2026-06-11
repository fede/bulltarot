import { describe, expect, it } from "vitest";

import { randomOrientation } from "./random";

describe("randomOrientation", () => {
  it("keeps cards upright for rolls below the 75% cutoff", () => {
    expect(randomOrientation(() => 0.74)).toBe("upright");
  });

  it("marks cards reversed at or above the 75% cutoff", () => {
    expect(randomOrientation(() => 0.75)).toBe("reversed");
  });
});