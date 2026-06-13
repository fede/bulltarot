import { useMemo, useState } from "react";

import { TAROT_CARDS } from "~/data/cards";
import { assertCardContentComplete } from "~/lib/tarot/content";
import { drawCards, resolveMeaning } from "~/lib/tarot/engine";
import { SPREADS } from "~/lib/tarot/spreads";
import type {
  DeckScope,
  DrawnCard,
  SpreadType,
  TarotFocus,
} from "~/lib/tarot/types";

export type TarotSessionPhase = "setup" | "reveal";

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
}>;

type StartSessionInput = Readonly<{
  spread: SpreadType;
  focus: TarotFocus;
  deckScope: DeckScope;
}>;

const INITIAL_STATE: TarotSessionState = {
  phase: "setup",
  cards: [],
  revealIndex: 0,
  setupError: null,
};

const DECK_IDS = TAROT_CARDS.map((card) => card.id);
const MAJOR_ARCANA_IDS = TAROT_CARDS.filter(
  (card) => card.arcana === "major",
).map((card) => card.id);
const TAROT_CARDS_BY_ID = new Map(TAROT_CARDS.map((card) => [card.id, card]));

export function useTarotSession() {
  const [state, setState] = useState<TarotSessionState>(INITIAL_STATE);

  const startSession = ({
    spread,
    focus,
    deckScope,
  }: StartSessionInput): void => {
    try {
      assertCardContentComplete(TAROT_CARDS);
    } catch {
      setState({
        phase: "setup",
        cards: [],
        revealIndex: 0,
        setupError: "Deck content incomplete. Please try again later.",
      });
      return;
    }

    const activeDeckIds =
      deckScope === "major_only" ? MAJOR_ARCANA_IDS : DECK_IDS;
    const positions = SPREADS[spread].positions;
    const drawnCards = drawCards({
      deckIds: activeDeckIds,
      count: positions.length,
      random: Math.random,
    });

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
    });
  };

  const revealNext = (): void => {
    setState((previousState) => {
      if (previousState.phase !== "reveal") {
        return previousState;
      }

      const nextIndex = previousState.revealIndex + 1;
      if (nextIndex >= previousState.cards.length) {
        return previousState;
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

  const currentCard = useMemo(() => {
    if (state.phase !== "reveal") {
      return null;
    }

    return state.cards[state.revealIndex] ?? null;
  }, [state.cards, state.phase, state.revealIndex]);

  return {
    phase: state.phase,
    cards: state.cards,
    revealIndex: state.revealIndex,
    setupError: state.setupError,
    currentCard,
    startSession,
    revealNext,
    restart,
  };
}
