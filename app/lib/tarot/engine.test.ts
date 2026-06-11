import { describe, expect, it } from "vitest";

import { drawCards, resolveMeaning, shuffleDeck } from "./engine";
import { SPREADS } from "./spreads";

const fullDeck = Array.from({ length: 78 }, (_, i) => i);

describe("tarot engine", () => {
  it("shuffleDeck keeps all ids without duplicates", () => {
    const shuffled = shuffleDeck(fullDeck, () => 0.42);

    expect(shuffled).toHaveLength(78);
    expect(new Set(shuffled).size).toBe(78);
    expect([...shuffled].sort((a, b) => a - b)).toEqual(fullDeck);
  });

  it("drawCards returns unique cards for spread size", () => {
    const draw = drawCards({
      deckIds: fullDeck,
      count: SPREADS.three_card.positions.length,
      random: () => 0.3,
    });

    expect(draw).toHaveLength(3);
    expect(new Set(draw.map((card) => card.cardId)).size).toBe(3);
  });

  it("drawCards assigns only upright or reversed orientation", () => {
    const draw = drawCards({
      deckIds: fullDeck,
      count: 10,
      random: () => 0.8,
    });

    for (const card of draw) {
      expect(["upright", "reversed"]).toContain(card.orientation);
    }
  });

  it("drawCards throws for invalid draw count", () => {
    expect(() =>
      drawCards({
        deckIds: fullDeck,
        count: -1,
        random: () => 0.5,
      }),
    ).toThrow(/Invalid draw count/);
  });

  it("drawCards throws when deck is too small", () => {
    expect(() =>
      drawCards({
        deckIds: [1, 2],
        count: 3,
        random: () => 0.5,
      }),
    ).toThrow(/cannot exceed deck size/i);
  });

  it("spread templates keep expected order and sizes", () => {
    expect(SPREADS.three_card.positions).toEqual(["Past", "Present", "Future"]);
    expect(SPREADS.three_card.positions).toHaveLength(3);

    expect(SPREADS.celtic_cross.positions).toHaveLength(10);
    expect(SPREADS.celtic_cross.positions[0]).toBe("Present");
    expect(SPREADS.celtic_cross.positions[9]).toBe("Final Outcome");
  });

  it("resolveMeaning selects orientation + focus", () => {
    const meaning = resolveMeaning({
      card: {
        upright: { general: "u-g", love: "u-l", career: "u-c" },
        reversed: { general: "r-g", love: "r-l", career: "r-c" },
      },
      orientation: "reversed",
      focus: "career",
    });

    expect(meaning).toBe("r-c");
  });
});