import { describe, expect, it } from "vitest";

import { TAROT_CARDS } from "~/data/cards";
import {
  assertCardContentComplete,
  getImagePath,
  type TarotCardContent,
} from "./content";

describe("tarot content", () => {
  it("builds image paths for card ids", () => {
    expect(getImagePath(0)).toBe("/cards/0.webp");
    expect(getImagePath(77)).toBe("/cards/77.webp");
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
