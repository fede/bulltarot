# BullTarot

BullTarot is a React Router web app for guided tarot readings.

It lets you choose a spread, focus area, and deck scope, then reveal cards one by one (or all at once) and finish with a full reading summary.

## What this project does

- Guided tarot session flow: setup -> reveal -> summary
- Supports 5 spread types:
  - 1-card daily pull
  - 3-card Past / Present / Future
  - 5-card Decision spread
  - 7-card Horseshoe
  - 10-card Celtic Cross
- Focus modes for interpretation:
  - general
  - love
  - career
- Deck scope options:
  - Major Arcana only (22 cards)
  - Full deck (78 cards)
- Randomized draw + random orientation (upright/reversed)
- Position-aware, focus-aware meaning resolution per drawn card
- Reading summary view with all revealed cards and meanings
- Asset fallback handling if a card image is missing

## Tech stack

- React 19
- React Router 7
- TypeScript
- Tailwind CSS 4
- Vite
- Vitest + Testing Library

## Local development

Install dependencies:

```bash
npm install
```

Start the app in development mode:

```bash
npm run dev
```

## Scripts

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run start      # Serve production build
npm run test       # Run tests once
npm run test:watch # Watch mode tests
npm run test:ui    # Vitest UI
npm run typecheck  # Generate route types + TypeScript check
```

## Production

Build:

```bash
npm run build
```

Run:

```bash
npm run start
```

## GitHub Pages (static)

This project is configured for static deployment to GitHub Pages using the workflow in `.github/workflows/deploy-pages.yml`.

How it works:

- Builds on pushes to `main` (or manual run).
- Uses root-relative paths (`/`) for assets, which is ideal when serving from a custom domain.
- Publishes `build/client` as the Pages artifact.
- Includes a custom static `404.html` with a floating card image at `public/cards/404.webp`.

One-time repository setup:

1. Go to **Settings -> Pages**.
2. Set **Source** to **GitHub Actions**.

## Docker

Build and run with Docker:

```bash
docker build -t bulltarot .
docker run -p 3000:3000 bulltarot
```

## Notes

- Card data integrity is validated before a reading starts.
- The app expects card front images in public/cards and uses /cards/back.webp for the card back.

---

Made with ❤️ by [Fede](https://fdrc.sh).
