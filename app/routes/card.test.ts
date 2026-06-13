import { describe, expect, it } from "vitest";

import { loader } from "./card";

describe("card route loader", () => {
  it("returns the matching card for a valid slug", async () => {
    const response = await loader({
      params: {
        slug: "king-of-swords",
      },
    } as never);

    expect(response.card?.name).toBe("King of Swords");
    expect(response.orientation).toBe("upright");
  });

  it("returns the matching card for a reversed slug", async () => {
    const response = await loader({
      params: {
        slug: "king-of-swords-reversed",
      },
    } as never);

    expect(response.card?.name).toBe("King of Swords");
    expect(response.orientation).toBe("reversed");
  });

  it("returns null when the slug is unknown", async () => {
    const response = await loader({
      params: {
        slug: "not-a-real-card",
      },
    } as never);

    expect(response.card).toBeNull();
    expect(response.orientation).toBeNull();
  });
});
