import { Link } from "react-router";

import { getNotFoundCardPath } from "~/lib/tarot/content";

import type { Route } from "./+types/not-found";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "404 | BullTarot" },
    { name: "description", content: "The path you sought is not in this spread." },
  ];
}

export default function NotFound() {
  return (
    <main className="tarot-not-found bg-night">
      <div className="tarot-wrap">
        <header className="tarot-header">
          <span className="tarot-kicker">The cards are silent</span>
          <h1 className="tarot-title">404</h1>
          <p className="tarot-not-found-copy">
            This path is not in the deck. Return to the table and draw again.
          </p>
        </header>

        <div className="tarot-not-found-card-wrap" aria-hidden="true">
          <img className="tarot-not-found-card" src={getNotFoundCardPath()} alt="" />
        </div>

        <Link className="tarot-button" to="/">
          Return Home
        </Link>
      </div>
    </main>
  );
}
