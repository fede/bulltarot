import { SPREADS } from "~/lib/tarot/spreads";
import type { DeckScope, SpreadType, TarotFocus } from "~/lib/tarot/types";

type SetupFormProps = Readonly<{
  spread: SpreadType;
  focus: TarotFocus;
  deckScope: DeckScope;
  onSpreadChange: (spread: SpreadType) => void;
  onFocusChange: (focus: TarotFocus) => void;
  onDeckScopeChange: (deckScope: DeckScope) => void;
  onSubmit: () => void;
}>;

export function SetupForm({
  spread,
  focus,
  deckScope,
  onSpreadChange,
  onFocusChange,
  onDeckScopeChange,
  onSubmit,
}: SetupFormProps) {
  const spreadOptions: Array<{ id: SpreadType; description: string }> = [
    {
      id: "single",
      description: "A quick one-card pull for focused guidance.",
    },
    {
      id: "three_card",
      description: "The arc of your situation across time.",
    },
    {
      id: "decision_spread",
      description: "Compare paths and clarify your best next move.",
    },
    {
      id: "horseshoe",
      description: "A seven-card arc for context and direction.",
    },
    {
      id: "celtic_cross",
      description: "A full ten-card map of your current path.",
    },
  ];

  const focusOptions: Array<{ id: TarotFocus; description: string }> = [
    { id: "general", description: "Overall guidance and life energy." },
    { id: "love", description: "Relationships, intimacy, and connection." },
    { id: "career", description: "Work, purpose, and material direction." },
  ];

  const deckOptions: Array<{
    id: DeckScope;
    title: string;
    description: string;
  }> = [
    {
      id: "major_only",
      title: "Major Arcana only",
      description: "Use the 22 archetypal cards for focused symbolic readings.",
    },
    {
      id: "all_cards",
      title: "All cards",
      description: "Use the complete 78-card deck for full nuance and detail.",
    },
  ];

  return (
    <section aria-label="Tarot setup" className="tarot-setup">
      <h2 className="tarot-section-title">Choose your spread</h2>

      <form
        className="tarot-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <fieldset className="tarot-spread-grid">
          <legend className="sr-only">Spread</legend>

          {spreadOptions.map((option) => {
            const isActive = spread === option.id;
            const spreadMeta = SPREADS[option.id];

            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isActive}
                className={`tarot-spread-card${isActive ? " is-active" : ""}`}
                onClick={() => onSpreadChange(option.id)}
              >
                <span className="tarot-spread-card-title">
                  {spreadMeta.label}
                </span>
                <span className="tarot-spread-card-count">
                  {spreadMeta.positions.length}
                  {spreadMeta.positions.length === 1 ? " card" : " cards"}
                </span>
                <p className="tarot-spread-card-description">
                  {option.description}
                </p>
              </button>
            );
          })}
        </fieldset>

        <fieldset className="tarot-focus-grid">
          <legend className="tarot-focus-legend">Choose your focus</legend>

          {focusOptions.map((focusOption) => {
            const isActive = focus === focusOption.id;
            const title =
              focusOption.id[0].toUpperCase() + focusOption.id.slice(1);

            return (
              <button
                key={focusOption.id}
                type="button"
                role="radio"
                aria-checked={isActive}
                className={`tarot-focus-card${isActive ? " is-active" : ""}`}
                onClick={() => onFocusChange(focusOption.id)}
              >
                <span className="tarot-focus-card-title">{title}</span>
                <p className="tarot-focus-card-description">
                  {focusOption.description}
                </p>
              </button>
            );
          })}
        </fieldset>

        <fieldset className="tarot-deck-grid">
          <legend className="tarot-focus-legend">Choose your deck</legend>

          {deckOptions.map((deckOption) => {
            const isActive = deckScope === deckOption.id;

            return (
              <button
                key={deckOption.id}
                type="button"
                role="radio"
                aria-checked={isActive}
                className={`tarot-focus-card${isActive ? " is-active" : ""}`}
                onClick={() => onDeckScopeChange(deckOption.id)}
              >
                <span className="tarot-focus-card-title">
                  {deckOption.title}
                </span>
                <p className="tarot-focus-card-description">
                  {deckOption.description}
                </p>
              </button>
            );
          })}
        </fieldset>

        <div className="tarot-setup-submit-wrap">
          <button
            type="submit"
            className="tarot-button tarot-button-wide tarot-setup-submit"
          >
            Shuffle &amp; Draw
          </button>
        </div>
      </form>
    </section>
  );
}
