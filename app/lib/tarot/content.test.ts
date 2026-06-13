import { describe, expect, it } from "vitest";

import { TAROT_CARDS } from "~/data/cards";
import {
  assertCardContentComplete,
  getCardBySlug,
  getCardSlug,
  getCardSlugVariant,
  getImagePath,
  getShareableImagePath,
  resolveCardSlug,
  type TarotCardContent,
} from "./content";

describe("tarot content", () => {
  it("builds image paths for card ids", () => {
    expect(getImagePath(0)).toBe("/cards/0.webp");
    expect(getImagePath(77)).toBe("/cards/77.webp");
  });

  it("builds shareable image paths for upright and reversed cards", () => {
    expect(getShareableImagePath(12, "upright")).toBe("/shareables/12.png");
    expect(getShareableImagePath(12, "reversed")).toBe(
      "/shareables/12-reversed.png",
    );
  });

  it("builds a stable slug for a card name", () => {
    expect(getCardSlug("King of Swords")).toBe("king-of-swords");
    expect(getCardSlug("The Fool")).toBe("the-fool");
  });

  it("looks up a card by slug", () => {
    expect(getCardBySlug("king-of-swords")?.name).toBe("King of Swords");
    expect(getCardBySlug("the-fool")?.name).toBe("The Fool");
    expect(getCardBySlug("not-a-real-card")).toBeNull();
  });

  it("builds a reversed variant slug", () => {
    expect(getCardSlugVariant("King of Swords", "upright")).toBe(
      "king-of-swords",
    );
    expect(getCardSlugVariant("King of Swords", "reversed")).toBe(
      "king-of-swords-reversed",
    );
  });

  it("resolves upright and reversed slugs", () => {
    expect(resolveCardSlug("king-of-swords")).toMatchObject({
      card: { name: "King of Swords" },
      orientation: "upright",
    });
    expect(resolveCardSlug("king-of-swords-reversed")).toMatchObject({
      card: { name: "King of Swords" },
      orientation: "reversed",
    });
    expect(resolveCardSlug("not-a-real-card")).toBeNull();
    expect(resolveCardSlug("not-a-real-card-reversed")).toBeNull();
  });

  it("does not throw for complete content", () => {
    const completeDeck = TAROT_CARDS.map((card) => ({
      ...card,
      interpretations: {
        upright: { ...card.interpretations.upright },
        reversed: { ...card.interpretations.reversed },
      },
    }));

    expect(() => assertCardContentComplete(completeDeck)).not.toThrow();
  });

  it("validates TAROT_CARDS with the integrity guard", () => {
    expect(() => assertCardContentComplete(TAROT_CARDS)).not.toThrow();
  });

  it("contains 78 cards with contiguous ids from 0 to 77", () => {
    expect(TAROT_CARDS).toHaveLength(78);

    const ids: number[] = TAROT_CARDS.map((card): number => card.id);
    ids.sort((a: number, b: number) => a - b);
    expect(ids).toEqual(Array.from({ length: 78 }, (_, i) => i));
  });

  it("throws when a meaning field is missing", () => {
    const incompleteDeck: TarotCardContent[] = TAROT_CARDS.map((card) => ({
      ...card,
      interpretations: {
        upright: { ...card.interpretations.upright },
        reversed: { ...card.interpretations.reversed },
      },
    }));

    incompleteDeck[1] = {
      ...incompleteDeck[1],
      interpretations: {
        ...incompleteDeck[1].interpretations,
        reversed: {
          ...incompleteDeck[1].interpretations.reversed,
          love: "",
        },
      },
    };

    expect(() => assertCardContentComplete(incompleteDeck)).toThrow(
      /incomplete/i,
    );
  });
});
