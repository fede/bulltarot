import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TAROT_CARDS } from "~/data/cards";
import * as tarotEngine from "~/lib/tarot/engine";

import { useTarotSession } from "./use-tarot-session";

const DAILY_PULL_STORAGE_KEY = "bulltarot:daily-pull:single";

function getLocalDateStamp(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, "0");
  const day = `${today.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

describe("useTarotSession", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts session with three_card -> 3 cards, revealIndex 0, complete false", () => {
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
    expect(result.current.complete).toBe(false);
    expect(result.current.currentCard).not.toBeNull();
  });

  it("reveal progression for single spread reaches complete true", () => {
    const { result } = renderHook(() => useTarotSession());

    act(() => {
      result.current.startSession({
        spread: "single",
        focus: "love",
        deckScope: "all_cards",
      });
    });

    expect(result.current.complete).toBe(false);
    expect(result.current.phase).toBe("reveal");

    act(() => {
      result.current.revealNext();
    });

    expect(result.current.phase).toBe("summary");
    expect(result.current.revealIndex).toBe(0);
    expect(result.current.complete).toBe(true);
    expect(result.current.currentCard).toBeNull();
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
    expect(result.current.complete).toBe(false);
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
      const sourceCard = TAROT_CARDS.find((card) => card.id === sessionCard.cardId);

      expect(sourceCard).toBeDefined();
      expect(sessionCard.name).toBe(sourceCard?.name);
    });
  });

  it("reuses cached single daily pull for same day and deck scope", () => {
    const cachedCard = TAROT_CARDS[12];
    localStorage.setItem(
      DAILY_PULL_STORAGE_KEY,
      JSON.stringify({
        date: getLocalDateStamp(),
        deckScope: "all_cards",
        cardId: cachedCard.id,
        orientation: "reversed",
      }),
    );

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
    expect(result.current.cards[0].cardId).toBe(cachedCard.id);
    expect(result.current.cards[0].orientation).toBe("reversed");
    expect(drawCardsSpy).not.toHaveBeenCalled();
  });

  it("ignores cached single daily pull with different deck scope and redraws", () => {
    const majorCard = TAROT_CARDS.find((card) => card.arcana === "major");

    if (!majorCard) {
      throw new Error("Expected at least one major arcana card.");
    }

    localStorage.setItem(
      DAILY_PULL_STORAGE_KEY,
      JSON.stringify({
        date: getLocalDateStamp(),
        deckScope: "major_only",
        cardId: majorCard.id,
        orientation: "upright",
      }),
    );

    const drawCardsSpy = vi
      .spyOn(tarotEngine, "drawCards")
      .mockReturnValue([{ cardId: TAROT_CARDS[0].id, orientation: "upright" }]);
    const { result } = renderHook(() => useTarotSession());

    act(() => {
      result.current.startSession({
        spread: "single",
        focus: "career",
        deckScope: "all_cards",
      });
    });

    expect(drawCardsSpy).toHaveBeenCalledTimes(1);
    expect(result.current.cards).toHaveLength(1);
    expect(result.current.cards[0].cardId).toBe(TAROT_CARDS[0].id);

    const saved = localStorage.getItem(DAILY_PULL_STORAGE_KEY);
    expect(saved).not.toBeNull();

    const parsed = JSON.parse(saved ?? "{}") as {
      date: string;
      deckScope: string;
      cardId: number;
      orientation: string;
    };
    expect(parsed.date).toBe(getLocalDateStamp());
    expect(parsed.deckScope).toBe("all_cards");
    expect(parsed.cardId).toBe(TAROT_CARDS[0].id);
    expect(parsed.orientation).toBe("upright");
  });
});