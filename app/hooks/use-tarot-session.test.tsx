import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TAROT_CARDS } from "~/data/cards";
import * as tarotEngine from "~/lib/tarot/engine";

import { useTarotSession } from "./use-tarot-session";

describe("useTarotSession", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts session with three_card -> 3 cards, revealIndex 0", () => {
    const { result } = renderHook(() => useTarotSession());

    act(() => {
      result.current.startSession({
        spread: "three_card",
        focus: "general",
        deckScope: "all_cards",
      });
    });

    expect(result.current.phase).toBe("reveal");
    expect(result.current.cards).toHaveLength(3);
    expect(result.current.revealIndex).toBe(0);
    expect(result.current.cards[0]).toEqual(
      expect.objectContaining({
        positionLabel: expect.any(String),
        resolvedMeaning: expect.any(String),
      }),
    );
    expect("position" in result.current.cards[0]).toBe(false);
    expect("meaning" in result.current.cards[0]).toBe(false);
    expect(result.current.currentCard).not.toBeNull();
  });

  it("reveal progression for single spread keeps reveal phase", () => {
    const { result } = renderHook(() => useTarotSession());

    act(() => {
      result.current.startSession({
        spread: "single",
        focus: "love",
        deckScope: "all_cards",
      });
    });

    expect(result.current.phase).toBe("reveal");

    act(() => {
      result.current.revealNext();
    });

    expect(result.current.phase).toBe("reveal");
    expect(result.current.revealIndex).toBe(0);
    expect(result.current.currentCard).not.toBeNull();
  });

  it("restart returns setup and empties cards", () => {
    const { result } = renderHook(() => useTarotSession());

    act(() => {
      result.current.startSession({
        spread: "three_card",
        focus: "career",
        deckScope: "all_cards",
      });
    });

    expect(result.current.phase).toBe("reveal");
    expect(result.current.cards.length).toBeGreaterThan(0);

    act(() => {
      result.current.restart();
    });

    expect(result.current.phase).toBe("setup");
    expect(result.current.cards).toHaveLength(0);
    expect(result.current.revealIndex).toBe(0);
    expect(result.current.currentCard).toBeNull();
  });

  it("maps each session card name from TAROT_CARDS by card id", () => {
    const { result } = renderHook(() => useTarotSession());

    act(() => {
      result.current.startSession({
        spread: "three_card",
        focus: "general",
        deckScope: "all_cards",
      });
    });

    result.current.cards.forEach((sessionCard) => {
      const sourceCard = TAROT_CARDS.find(
        (card) => card.id === sessionCard.cardId,
      );

      expect(sourceCard).toBeDefined();
      expect(sessionCard.name).toBe(sourceCard?.name);
    });
  });

  it("always draws a new single-card pull", () => {
    const drawCardsSpy = vi.spyOn(tarotEngine, "drawCards");
    const { result } = renderHook(() => useTarotSession());

    act(() => {
      result.current.startSession({
        spread: "single",
        focus: "general",
        deckScope: "all_cards",
      });
    });

    expect(result.current.phase).toBe("reveal");
    expect(result.current.cards).toHaveLength(1);
    expect(drawCardsSpy).toHaveBeenCalledTimes(1);
  });
});
