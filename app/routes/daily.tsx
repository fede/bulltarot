import { useEffect, useMemo, useState } from "react";

import { RevealStep } from "~/components/tarot/reveal-step";
import { useTarotSession } from "~/hooks/use-tarot-session";

import type { Route } from "./+types/daily";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Daily Pull | BullTarot" },
    {
      name: "description",
      content: "Your one-card pull for a quick check-in whenever you need it.",
    },
  ];
}

export default function DailyPullRoute() {
  const [revealedCards, setRevealedCards] = useState<boolean[]>([]);
  const session = useTarotSession();

  useEffect(() => {
    if (session.phase !== "setup" || session.setupError) {
      return;
    }

    session.startSession({
      spread: "single",
      focus: "general",
      deckScope: "all_cards",
    });
  }, [session.phase, session.setupError, session.startSession]);

  useEffect(() => {
    if (session.phase === "reveal") {
      setRevealedCards((previous) => {
        if (previous.length === session.cards.length) {
          return previous;
        }

        return new Array(session.cards.length).fill(false);
      });
      return;
    }

    setRevealedCards([]);
  }, [session.cards.length, session.phase]);

  const allRevealed = useMemo(
    () => revealedCards.length > 0 && revealedCards.every(Boolean),
    [revealedCards],
  );

  const revealCard = (index: number): void => {
    setRevealedCards((previous) => {
      if (previous[index]) {
        return previous;
      }

      const next = [...previous];
      next[index] = true;
      return next;
    });
  };

  const revealAll = (): void => {
    setRevealedCards(new Array(session.cards.length).fill(true));
  };

  if (session.phase === "setup") {
    return (
      <main className="tarot-shell bg-night">
        <div className="tarot-wrap">
          <header className="tarot-header">
            <span className="tarot-kicker">One-card check-in</span>
            <h1 className="tarot-title">Daily Pull</h1>
            <p className="tarot-subtitle">Draw one card from the full deck.</p>
          </header>

          {session.setupError ? (
            <p role="alert" aria-live="polite" className="tarot-alert">
              {session.setupError}
            </p>
          ) : (
            <p className="tarot-subtitle" aria-live="polite">
              Shuffling your daily pull...
            </p>
          )}
        </div>
      </main>
    );
  }

  if (session.phase === "reveal" && session.cards.length > 0) {
    return (
      <main className="tarot-shell bg-night">
        <div className="tarot-wrap">
          <header className="tarot-header">
            <h1 className="tarot-title">Daily Pull</h1>
          </header>

          <RevealStep
            cards={session.cards}
            revealedCards={revealedCards}
            onRevealCard={revealCard}
            onRevealAll={revealAll}
            allRevealed={allRevealed}
            onRestart={session.restart}
            cta={false}
          />
        </div>
      </main>
    );
  }

  return null;
}
