import { useState } from "react";

import type { TarotSessionCard } from "~/hooks/use-tarot-session";
import { getCardBackPath, getImagePath } from "~/lib/tarot/content";

type RevealStepProps = Readonly<{
  cards: TarotSessionCard[];
  revealedCards: boolean[];
  onRevealCard: (index: number) => void;
  onRevealAll: () => void;
  allRevealed: boolean;
  onRestart: () => void;
  title?: string;
  cta?: boolean;
}>;

export function RevealStep({
  cards,
  revealedCards,
  onRevealCard,
  onRevealAll,
  allRevealed,
  onRestart,
  title,
  cta = true,
}: RevealStepProps) {
  const [missingFrontIds, setMissingFrontIds] = useState<number[]>([]);

  const flagMissingFront = (cardId: number): void => {
    setMissingFrontIds((previous) =>
      previous.includes(cardId) ? previous : [...previous, cardId],
    );
  };

  return (
    <section aria-label="Guided reveal" className="tarot-reveal">
      {title ? <h2 className="tarot-section-title">{title}</h2> : null}

      <div
        className={`tarot-table-grid tarot-table-grid-${Math.min(cards.length, 10)}`}
      >
        {cards.map((card, index) => {
          const revealed = revealedCards[index] ?? false;
          const frontMissing = missingFrontIds.includes(card.cardId);

          return (
            <div
              key={`${card.positionLabel}-${card.cardId}`}
              className="tarot-table-slot"
            >
              <p className="tarot-position-label">{card.positionLabel}</p>

              <button
                type="button"
                className={`tarot-flip-card${revealed ? " is-revealed" : ""}`}
                aria-label={
                  revealed
                    ? `${card.name}${card.orientation === "reversed" ? ", reversed" : ""}`
                    : `Reveal card for ${card.positionLabel}`
                }
                onClick={() => onRevealCard(index)}
              >
                <span className="tarot-flip-inner">
                  <span className="tarot-face tarot-face-back">
                    <img
                      className="tarot-card-image"
                      src={getCardBackPath()}
                      alt={`Card back for ${card.positionLabel}`}
                    />
                  </span>

                  <span className="tarot-face tarot-face-front">
                    {frontMissing ? (
                      <p className="tarot-fallback">Image unavailable</p>
                    ) : (
                      <img
                        className={`tarot-card-image${card.orientation === "reversed" ? " is-reversed" : ""}`}
                        src={getImagePath(card.cardId)}
                        alt={card.name}
                        onError={() => flagMissingFront(card.cardId)}
                      />
                    )}
                  </span>
                </span>
              </button>

              {revealed ? (
                <article className="tarot-slot-reading tarot-card">
                  <p className="tarot-card-name">{card.name}</p>
                  {card.orientation === "reversed" ? (
                    <span className="tarot-reversed-badge">Reversed</span>
                  ) : null}
                  <p className="tarot-card-meaning">{card.resolvedMeaning}</p>
                </article>
              ) : null}
            </div>
          );
        })}
      </div>
      {cta && (
        <div className="tarot-action-row">
          {!allRevealed ? (
            <button
              type="button"
              className="tarot-button"
              onClick={onRevealAll}
            >
              Reveal All
            </button>
          ) : null}
          <button type="button" className="tarot-button" onClick={onRestart}>
            New Reading
          </button>
        </div>
      )}
    </section>
  );
}
