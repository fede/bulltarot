import type { Route } from "./+types/home";
import { useEffect, useMemo, useState } from "react";

import { RevealStep } from "~/components/tarot/reveal-step";
import { SetupForm } from "~/components/tarot/setup-form";
import { useTarotSession } from "~/hooks/use-tarot-session";
import { trackEvent } from "~/lib/analytics";
import { getCardBackPath } from "~/lib/tarot/content";
import { SPREADS } from "~/lib/tarot/spreads";
import type { DeckScope, SpreadType, TarotFocus } from "~/lib/tarot/types";

export function meta({}: Route.MetaArgs) {
  const title = "BullTarot";
  const description =
    "Discover playful bull terrier tarot readings with dog-themed card meanings for love, career, and life-upright, reversed, and full of zoomies.";
  const image = "https://bulltarot.com/cards/og.webp";

  return [
    { title },
    {
      name: "description",
      content: description,
    },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: title },
    { property: "og:locale", content: "en_US" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: "/" },
    { property: "og:image", content: image },
    { property: "og:image:alt", content: "BullTarot card back artwork" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: "BullTarot card back artwork" },
  ];
}

export default function Home() {
  const [hasBegun, setHasBegun] = useState(false);
  const [spread, setSpread] = useState<SpreadType>("single");
  const [focus, setFocus] = useState<TarotFocus>("general");
  const [deckScope, setDeckScope] = useState<DeckScope>("all_cards");
  const [revealedCards, setRevealedCards] = useState<boolean[]>([]);
  const session = useTarotSession();

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

      const revealedCount = next.filter(Boolean).length;
      trackEvent("tarot_card_revealed", {
        spread,
        focus,
        deck_scope: deckScope,
        card_index: index + 1,
        revealed_count: revealedCount,
        total_cards: session.cards.length,
        all_revealed: revealedCount === session.cards.length,
      });

      return next;
    });
  };

  const revealAll = (): void => {
    trackEvent("tarot_reveal_all", {
      spread,
      focus,
      deck_scope: deckScope,
      total_cards: session.cards.length,
    });
    setRevealedCards(new Array(session.cards.length).fill(true));
  };

  if (!hasBegun) {
    return (
      <main className="tarot-shell bg-night">
        <div className="tarot-wrap">
          <header className="tarot-header">
            <span className="tarot-kicker">
              Mystical spread readings by dogs
            </span>
            <h1 className="tarot-title">BullTarot</h1>
            <p className="tarot-subtitle">
              Center your question, choose a spread, and let the cards fall as
              they may.
            </p>
          </header>

          <div className="tarot-hero-card-wrap" aria-hidden="true">
            <img
              className="tarot-hero-card"
              src={getCardBackPath()}
              alt=""
              loading="eager"
            />
          </div>

          <button
            type="button"
            className="tarot-button"
            onClick={() => {
              trackEvent("tarot_begin_clicked", {
                entrypoint: "home",
              });
              setHasBegun(true);
            }}
          >
            Begin
          </button>
        </div>
      </main>
    );
  }

  if (session.phase === "setup") {
    return (
      <main className="tarot-shell bg-night">
        <div className="tarot-wrap">
          <header className="tarot-header">
            <span className="tarot-kicker">
              Mystical spread readings by dogs
            </span>
            <h1 className="tarot-title">BullTarot</h1>
            <p className="tarot-subtitle">
              Choose your spread and draw with intention.
            </p>
          </header>
          {session.setupError ? (
            <p role="alert" aria-live="polite" className="tarot-alert">
              {session.setupError}
            </p>
          ) : null}
          <SetupForm
            spread={spread}
            focus={focus}
            deckScope={deckScope}
            onSpreadChange={(nextSpread) => {
              trackEvent("tarot_option_changed", {
                option: "spread",
                value: nextSpread,
              });
              setSpread(nextSpread);
            }}
            onFocusChange={(nextFocus) => {
              trackEvent("tarot_option_changed", {
                option: "focus",
                value: nextFocus,
              });
              setFocus(nextFocus);
            }}
            onDeckScopeChange={(nextDeckScope) => {
              trackEvent("tarot_option_changed", {
                option: "deck_scope",
                value: nextDeckScope,
              });
              setDeckScope(nextDeckScope);
            }}
            onSubmit={() => {
              trackEvent("tarot_shuffle_draw", {
                spread,
                focus,
                deck_scope: deckScope,
              });
              session.startSession({ spread, focus, deckScope });
            }}
          />
          <footer className="tarot-footer">
            For reflection and entertainment. Trust your intuition above all.
            Made with ❤️ by{" "}
            <a href="https://fdrc.sh" className="tarot-footer-link">
              Fede
            </a>
            .
          </footer>
        </div>
      </main>
    );
  }

  if (session.phase === "reveal" && session.cards.length > 0) {
    return (
      <main className="tarot-shell bg-night">
        <div className="tarot-wrap">
          <header className="tarot-header">
            <h1 className="tarot-title">BullTarot</h1>
          </header>
          <RevealStep
            title="Tap each card to unveil it."
            cards={session.cards}
            revealedCards={revealedCards}
            onRevealCard={revealCard}
            onRevealAll={revealAll}
            allRevealed={allRevealed}
            onRestart={() => {
              trackEvent("tarot_new_reading_from_reveal", {
                spread,
                focus,
                deck_scope: deckScope,
                all_cards_revealed: allRevealed,
                revealed_cards: revealedCards.filter(Boolean).length,
                total_cards: session.cards.length,
              });
              session.restart();
            }}
          />
          {spread === "single" ? (
            <footer className="tarot-footer">
              Bookmark your{" "}
              <a href="/daily" className="tarot-footer-link underline">
                daily pull
              </a>{" "}
              whenever you need quick guidance.
            </footer>
          ) : null}
        </div>
      </main>
    );
  }

  return null;
}
