import type { CardInterpretations } from "./types";

export type TarotArcana = "major" | "minor";
export type TarotSuit = "wands" | "cups" | "swords" | "pentacles";
export type TarotRank =
  | "ace"
  | "two"
  | "three"
  | "four"
  | "five"
  | "six"
  | "seven"
  | "eight"
  | "nine"
  | "ten"
  | "page"
  | "knight"
  | "queen"
  | "king";

export type TarotCardContent = {
  readonly id: number;
  readonly name: string;
  readonly arcana: TarotArcana;
  readonly suit: TarotSuit | null;
  readonly rank: TarotRank | null;
  readonly interpretations: CardInterpretations;
};

function getAssetPath(assetPath: string): string {
  const cleanPath = assetPath.startsWith("/") ? assetPath.slice(1) : assetPath;
  return `${import.meta.env.BASE_URL}${cleanPath}`;
}

export function getImagePath(cardId: number): string {
  return getAssetPath(`cards/${cardId}.webp`);
}

export function getCardBackPath(): string {
  return getAssetPath("cards/back.webp");
}

export function getNotFoundCardPath(): string {
  return getAssetPath("cards/404.webp");
}

export function assertCardContentComplete(
  cards: readonly TarotCardContent[],
): void {
  if (cards.length !== 78) {
    throw new Error(
      `Card content integrity error: expected 78 cards, got ${cards.length}.`,
    );
  }

  const seenIds = new Set<number>();

  for (const card of cards) {
    if (!Number.isInteger(card.id)) {
      throw new Error(
        `Card content integrity error: id ${card.id} is not an integer.`,
      );
    }

    if (card.id < 0 || card.id > 77) {
      throw new Error(
        `Card content integrity error: id ${card.id} is out of range 0..77.`,
      );
    }

    if (seenIds.has(card.id)) {
      throw new Error(`Card content integrity error: duplicate id ${card.id}.`);
    }
    seenIds.add(card.id);

    if (!card.name || !card.name.trim()) {
      throw new Error(
        `Card content incomplete for id ${card.id}: missing name.`,
      );
    }

    if (card.arcana !== "major" && card.arcana !== "minor") {
      throw new Error(
        `Card content incomplete for id ${card.id} (${card.name}): invalid arcana.`,
      );
    }

    const isValidSuit =
      card.suit === "wands" ||
      card.suit === "cups" ||
      card.suit === "swords" ||
      card.suit === "pentacles";
    const isValidRank =
      card.rank === "ace" ||
      card.rank === "two" ||
      card.rank === "three" ||
      card.rank === "four" ||
      card.rank === "five" ||
      card.rank === "six" ||
      card.rank === "seven" ||
      card.rank === "eight" ||
      card.rank === "nine" ||
      card.rank === "ten" ||
      card.rank === "page" ||
      card.rank === "knight" ||
      card.rank === "queen" ||
      card.rank === "king";

    if (card.arcana === "major") {
      if (card.suit !== null || card.rank !== null) {
        throw new Error(
          `Card content incomplete for id ${card.id} (${card.name}): major arcana must have null suit/rank.`,
        );
      }
    } else {
      if (!isValidSuit || !isValidRank) {
        throw new Error(
          `Card content incomplete for id ${card.id} (${card.name}): minor arcana must include valid suit and rank.`,
        );
      }
    }

    const entries: Array<[string, string | undefined]> = [
      ["upright.general", card.interpretations?.upright?.general],
      ["upright.love", card.interpretations?.upright?.love],
      ["upright.career", card.interpretations?.upright?.career],
      ["reversed.general", card.interpretations?.reversed?.general],
      ["reversed.love", card.interpretations?.reversed?.love],
      ["reversed.career", card.interpretations?.reversed?.career],
    ];

    for (const [field, value] of entries) {
      if (!value || !value.trim()) {
        throw new Error(
          `Card content incomplete for id ${card.id} (${card.name}): missing ${field}.`,
        );
      }
    }
  }

  for (let expectedId = 0; expectedId <= 77; expectedId += 1) {
    if (!seenIds.has(expectedId)) {
      throw new Error(
        `Card content integrity error: missing id ${expectedId}.`,
      );
    }
  }
}
