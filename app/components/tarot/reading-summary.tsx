import type { TarotSessionCard } from "~/hooks/use-tarot-session";

type ReadingSummaryProps = Readonly<{
  cards: TarotSessionCard[];
  onRestart: () => void;
}>;

export function ReadingSummary({ cards, onRestart }: ReadingSummaryProps) {
  return (
    <section aria-label="Reading summary">
      <h2 className="tarot-section-title">Reading Summary</h2>

      <ol className="tarot-summary-list">
        {cards.map((card) => (
          <li key={card.cardId + card.positionLabel} className="tarot-card">
            <h3 className="tarot-position-label">{card.positionLabel}</h3>
            <p className="tarot-card-name">{card.name}</p>
            {card.orientation === "reversed" ? (
              <span className="tarot-reversed-badge">Reversed</span>
            ) : null}
            <p className="tarot-card-meaning">{card.resolvedMeaning}</p>
          </li>
        ))}
      </ol>

      <button type="button" className="tarot-button" onClick={onRestart}>
        Start New Reading
      </button>
    </section>
  );
}
