import { useMemo, useState } from "react";

import { TAROT_CARDS } from "~/data/cards";
import { assertCardContentComplete } from "~/lib/tarot/content";
import { drawCards, resolveMeaning } from "~/lib/tarot/engine";
import { SPREADS } from "~/lib/tarot/spreads";
import type { DeckScope, DrawnCard, SpreadType, TarotFocus } from "~/lib/tarot/types";

export type TarotSessionPhase = "setup" | "reveal" | "summary";

export type TarotSessionCard = Readonly<{
  cardId: number;
  name: string;
  orientation: DrawnCard["orientation"];
  positionLabel: string;
  resolvedMeaning: string;
}>;

type TarotSessionState = Readonly<{
  phase: TarotSessionPhase;
  cards: TarotSessionCard[];
  revealIndex: number;
  setupError: string | null;
  dailyPullRedeemed: boolean;
}>;

type StartSessionInput = Readonly<{
  spread: SpreadType;
  focus: TarotFocus;
  deckScope: DeckScope;
}>;

type DailyPullCache = Readonly<{
  date: string;
  deckScope: DeckScope;
  cardId: number;
  orientation: DrawnCard["orientation"];
}>;

const INITIAL_STATE: TarotSessionState = {
  phase: "setup",
  cards: [],
  revealIndex: 0,
  setupError: null,
  dailyPullRedeemed: false,
};

const DECK_IDS = TAROT_CARDS.map((card) => card.id);
const MAJOR_ARCANA_IDS = TAROT_CARDS.filter((card) => card.arcana === "major").map(
  (card) => card.id,
);
const TAROT_CARDS_BY_ID = new Map(TAROT_CARDS.map((card) => [card.id, card]));
const DAILY_PULL_STORAGE_KEY = "bulltarot:daily-pull:single";

function getLocalDateStamp(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, "0");
  const day = `${today.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function readDailyPull(deckScope: DeckScope): DrawnCard | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(DAILY_PULL_STORAGE_KEY);
    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue) as Partial<DailyPullCache>;
    if (
      parsed.date !== getLocalDateStamp() ||
      parsed.deckScope !== deckScope ||
      typeof parsed.cardId !== "number" ||
      (parsed.orientation !== "upright" && parsed.orientation !== "reversed")
    ) {
      return null;
    }

    return {
      cardId: parsed.cardId,
      orientation: parsed.orientation,
    };
  } catch {
    return null;
  }
}

function writeDailyPull(deckScope: DeckScope, drawnCard: DrawnCard): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const payload: DailyPullCache = {
      date: getLocalDateStamp(),
      deckScope,
      cardId: drawnCard.cardId,
      orientation: drawnCard.orientation,
    };

    window.localStorage.setItem(DAILY_PULL_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage failures; drawing still works without persistence.
  }
}

export function useTarotSession() {
  const [state, setState] = useState<TarotSessionState>(INITIAL_STATE);

  const startSession = ({ spread, focus, deckScope }: StartSessionInput): void => {
    try {
      assertCardContentComplete(TAROT_CARDS);
    } catch {
      setState({
        phase: "setup",
        cards: [],
        revealIndex: 0,
        setupError: "Deck content incomplete. Please try again later.",
        dailyPullRedeemed: false,
      });
      return;
    }

    const activeDeckIds = deckScope === "major_only" ? MAJOR_ARCANA_IDS : DECK_IDS;
    const positions = SPREADS[spread].positions;
    let drawnCards: DrawnCard[];

    let dailyPullRedeemed = false;

    if (spread === "single") {
      const cachedDailyPull = readDailyPull(deckScope);
      if (cachedDailyPull && activeDeckIds.includes(cachedDailyPull.cardId)) {
        drawnCards = [cachedDailyPull];
        dailyPullRedeemed = true;
      } else {
        drawnCards = drawCards({
          deckIds: activeDeckIds,
          count: positions.length,
          random: Math.random,
        });
        writeDailyPull(deckScope, drawnCards[0]);
      }
    } else {
      drawnCards = drawCards({
        deckIds: activeDeckIds,
        count: positions.length,
        random: Math.random,
      });
    }

    const cards = drawnCards.map((drawnCard, index): TarotSessionCard => {
      const card = TAROT_CARDS_BY_ID.get(drawnCard.cardId);
      if (!card) {
        throw new Error(
          `Invalid tarot card id '${drawnCard.cardId}' returned by drawCards.`,
        );
      }

      return {
        cardId: drawnCard.cardId,
        name: card.name,
        orientation: drawnCard.orientation,
        positionLabel: positions[index],
        resolvedMeaning: resolveMeaning({
          card: card.interpretations,
          orientation: drawnCard.orientation,
          focus,
        }),
      };
    });

    setState({
      phase: "reveal",
      cards,
      revealIndex: 0,
      setupError: null,
      dailyPullRedeemed,
    });
  };

  const revealNext = (): void => {
    setState((previousState) => {
      if (previousState.phase !== "reveal") {
        return previousState;
      }

      const nextIndex = previousState.revealIndex + 1;
      if (nextIndex >= previousState.cards.length) {
        return {
          ...previousState,
          phase: "summary",
          revealIndex: previousState.revealIndex,
        };
      }

      return {
        ...previousState,
        revealIndex: nextIndex,
      };
    });
  };

  const restart = (): void => {
    setState(INITIAL_STATE);
  };

  const finishReading = (): void => {
    setState((previousState) => {
      if (previousState.phase !== "reveal") {
        return previousState;
      }

      return {
        ...previousState,
        phase: "summary",
      };
    });
  };

  const currentCard = useMemo(() => {
    if (state.phase !== "reveal") {
      return null;
    }

    return state.cards[state.revealIndex] ?? null;
  }, [state.cards, state.phase, state.revealIndex]);

  const complete = state.phase === "summary";

  return {
    phase: state.phase,
    cards: state.cards,
    revealIndex: state.revealIndex,
    setupError: state.setupError,
    dailyPullRedeemed: state.dailyPullRedeemed,
    currentCard,
    complete,
    startSession,
    revealNext,
    finishReading,
    restart,
  };
}