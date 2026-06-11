export type TarotFocus = "general" | "love" | "career";

export type TarotOrientation = "upright" | "reversed";

export type SpreadType =
  | "single"
  | "three_card"
  | "decision_spread"
  | "horseshoe"
  | "celtic_cross";

export type DeckScope = "major_only" | "all_cards";

export type CardInterpretations = Readonly<{
  upright: Readonly<Record<TarotFocus, string>>;
  reversed: Readonly<Record<TarotFocus, string>>;
}>;

export type DrawnCard = Readonly<{
  cardId: number;
  orientation: TarotOrientation;
}>;