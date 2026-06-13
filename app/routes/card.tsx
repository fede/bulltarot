import { Link } from "react-router";

import {
  getCardSlugVariant,
  getImagePath,
  getNotFoundCardPath,
  resolveCardSlug,
} from "~/lib/tarot/content";

import type { Route } from "./+types/card";

export function loader({ params }: Route.LoaderArgs) {
  const slug = params.slug ?? "";
  const resolved = resolveCardSlug(slug);

  return {
    card: resolved?.card ?? null,
    orientation: resolved?.orientation ?? null,
  };
}

export function meta({ data, params }: Route.MetaArgs) {
  const fallbackSlug = params.slug ?? "card";

  if (!data?.card || !data.orientation) {
    return [
      { title: `Card Not Found | BullTarot` },
      {
        name: "description",
        content: `No tarot card matches \"${fallbackSlug}\".`,
      },
    ];
  }

  return [
    { title: `${data.card.name} (${data.orientation}) | BullTarot` },
    {
      name: "description",
      content: `Explore the ${data.orientation} meaning of ${data.card.name}.`,
    },
    {
      property: "og:title",
      content: `${data.card.name} (${data.orientation}) | BullTarot`,
    },
    {
      property: "og:description",
      content: `Direct ${data.orientation} card page for ${data.card.name}.`,
    },
  ];
}

export default function CardRoute({ loaderData }: Route.ComponentProps) {
  const { card, orientation } = loaderData;

  if (!card || !orientation) {
    return (
      <main className="tarot-not-found bg-night">
        <div className="tarot-wrap">
          <header className="tarot-header">
            <span className="tarot-kicker">Unknown card</span>
            <h1 className="tarot-title">Card Not Found</h1>
            <p className="tarot-not-found-copy">
              This slug is not in the deck. Check the URL and try again.
            </p>
          </header>

          <div className="tarot-not-found-card-wrap" aria-hidden="true">
            <img
              className="tarot-not-found-card"
              src={getNotFoundCardPath()}
              alt=""
            />
          </div>

          <Link className="tarot-button" to="/">
            Return Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="tarot-shell bg-night">
      <div className="tarot-wrap">
        <header className="tarot-header">
          <span className="tarot-kicker">Direct card page</span>
          <h1 className="tarot-title">{card.name}</h1>
        </header>

        <div className="tarot-not-found-card-wrap" aria-hidden="true">
          <img
            className="tarot-not-found-card"
            src={getImagePath(card.id)}
            alt=""
          />
        </div>

        <article className="tarot-card tarot-card-static">
          <h2 className="tarot-card-name">
            {orientation === "reversed" ? "Reversed" : "Upright"}
          </h2>
          <p className="tarot-card-meaning">
            {orientation === "reversed"
              ? card.interpretations.reversed.general
              : card.interpretations.upright.general}
          </p>
        </article>

        <Link className="tarot-button" to="/">
          Back to reading
        </Link>
      </div>
    </main>
  );
}
