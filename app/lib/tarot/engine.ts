import { fisherYates, randomOrientation } from "./random";
import type {
  CardInterpretations,
  DrawnCard,
  TarotFocus,
  TarotOrientation,
} from "./types";

type DrawCardsInput = {
  deckIds: number[];
  count: number;
  random: () => number;
};

type ResolveMeaningInput = {
  card: CardInterpretations;
  orientation: TarotOrientation;
  focus: TarotFocus;
};

export function shuffleDeck(deckIds: number[], random: () => number): number[] {
  return fisherYates(deckIds, random);
}

export function drawCards({ deckIds, count, random }: DrawCardsInput): DrawnCard[] {
  if (!Number.isInteger(count) || count < 0) {
    throw new Error(`Invalid draw count: ${count}. Count must be an integer >= 0.`);
  }

  if (count > deckIds.length) {
    throw new Error(
      `Invalid draw count: ${count}. Count cannot exceed deck size (${deckIds.length}).`,
    );
  }

  const shuffled = shuffleDeck(deckIds, random);

  return shuffled.slice(0, count).map((cardId) => ({
    cardId,
    orientation: randomOrientation(random),
  }));
}

export function resolveMeaning({
  card,
  orientation,
  focus,
}: ResolveMeaningInput): string {
  return card[orientation][focus];
}