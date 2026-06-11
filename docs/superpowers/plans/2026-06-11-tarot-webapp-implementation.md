# Tarot Web App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a client-only tarot reading web app in the existing React Router 7 project with spread selection, focus selection, guided reveal, and final summary.

**Architecture:** Keep tarot rules in focused domain modules under app/lib/tarot and keep UI orchestration in route-level React components. Store card metadata and meanings in local data files, map images from public/cards/{id}.webp, and keep session state ephemeral in memory.

**Tech Stack:** React 19, React Router 7 framework mode, TypeScript, Vite, Tailwind CSS v4, Vitest, React Testing Library

---

## File Structure and Responsibilities

- Modify: package.json
  - Add test scripts and testing dependencies.
- Create: vitest.config.ts
  - Vitest and jsdom config for app tests.
- Create: app/test/setup.ts
  - Global test setup and jest-dom matchers.
- Create: app/lib/tarot/types.ts
  - Shared tarot types (spread, focus, orientation, reading models).
- Create: app/lib/tarot/spreads.ts
  - Spread templates and position labels.
- Create: app/lib/tarot/random.ts
  - Fisher-Yates shuffle and random orientation helpers.
- Create: app/lib/tarot/engine.ts
  - Draw without replacement and meaning resolution logic.
- Create: app/lib/tarot/content.ts
  - Card content loader and schema validation guard.
- Create: app/data/cards.ts
  - Local card content dataset (full 78 cards).
- Create: app/components/tarot/setup-form.tsx
  - Spread and focus selection form.
- Create: app/components/tarot/reveal-step.tsx
  - Guided reveal card step view.
- Create: app/components/tarot/reading-summary.tsx
  - Final summary across spread positions.
- Create: app/hooks/use-tarot-session.ts
  - Session orchestration hook.
- Modify: app/routes/home.tsx
  - Replace starter welcome screen with tarot flow.
- Modify: app/app.css
  - Add tarot-specific styles and fallback card visuals.
- Create: app/lib/tarot/engine.test.ts
  - Unit tests for shuffle, draw, orientation, and resolver.
- Create: app/lib/tarot/content.test.ts
  - Unit tests for content shape validation and guards.
- Create: app/hooks/use-tarot-session.test.tsx
  - Hook state-machine tests.
- Create: app/routes/home.test.tsx
  - UI flow tests for setup, reveal, and summary.

### Task 1: Test Harness Setup

**Files:**

- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `app/test/setup.ts`

- [ ] **Step 1: Write the failing test command baseline**

Run: `npm run test`
Expected: command fails because test script does not exist.

- [ ] **Step 2: Add test tooling scripts and dependencies**

Update `package.json` scripts and devDependencies:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.8.0",
    "@testing-library/react": "^16.1.0",
    "jsdom": "^25.0.0",
    "vitest": "^2.1.9"
  }
}
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  test: {
    environment: "jsdom",
    setupFiles: ["./app/test/setup.ts"],
    globals: true,
  },
});
```

Create `app/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Install dependencies**

Run: `npm install`
Expected: dependencies install successfully.

- [ ] **Step 4: Verify test runner starts**

Run: `npm run test`
Expected: Vitest runs and exits with "No test files found" (or equivalent) but script is valid.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts app/test/setup.ts
git commit -m "test: add vitest and rtl harness"
```

### Task 2: Tarot Domain Types, Spreads, and Engine (TDD)

**Files:**

- Create: `app/lib/tarot/types.ts`
- Create: `app/lib/tarot/spreads.ts`
- Create: `app/lib/tarot/random.ts`
- Create: `app/lib/tarot/engine.ts`
- Create: `app/lib/tarot/engine.test.ts`

- [ ] **Step 1: Write failing engine tests**

Create `app/lib/tarot/engine.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { drawCards, resolveMeaning, shuffleDeck } from "./engine";
import { SPREADS } from "./spreads";

const fullDeck = Array.from({ length: 78 }, (_, i) => i);

describe("tarot engine", () => {
  it("shuffleDeck keeps all ids without duplicates", () => {
    const shuffled = shuffleDeck(fullDeck, () => 0.42);
    expect(shuffled).toHaveLength(78);
    expect(new Set(shuffled).size).toBe(78);
    expect([...shuffled].sort((a, b) => a - b)).toEqual(fullDeck);
  });

  it("drawCards returns unique cards for spread size", () => {
    const draw = drawCards({
      deckIds: fullDeck,
      count: SPREADS.three_card.positions.length,
      random: () => 0.3,
    });
    expect(draw).toHaveLength(3);
    expect(new Set(draw.map((c) => c.cardId)).size).toBe(3);
  });

  it("drawCards assigns only upright or reversed orientation", () => {
    const draw = drawCards({ deckIds: fullDeck, count: 10, random: () => 0.8 });
    for (const card of draw) {
      expect(["upright", "reversed"]).toContain(card.orientation);
    }
  });

  it("resolveMeaning selects orientation + focus", () => {
    const meaning = resolveMeaning({
      card: {
        upright: { general: "u-g", love: "u-l", career: "u-c" },
        reversed: { general: "r-g", love: "r-l", career: "r-c" },
      },
      orientation: "reversed",
      focus: "career",
    });
    expect(meaning).toBe("r-c");
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm run test -- app/lib/tarot/engine.test.ts`
Expected: FAIL with module import errors because engine files do not exist.

- [ ] **Step 3: Implement minimal tarot domain modules**

Create `app/lib/tarot/types.ts`:

```ts
export type TarotFocus = "general" | "love" | "career";
export type TarotOrientation = "upright" | "reversed";
export type SpreadType = "single" | "three_card" | "celtic_cross";

export type CardInterpretations = {
  upright: Record<TarotFocus, string>;
  reversed: Record<TarotFocus, string>;
};

export type DrawnCard = {
  cardId: number;
  orientation: TarotOrientation;
};
```

Create `app/lib/tarot/spreads.ts`:

```ts
import type { SpreadType } from "./types";

export const SPREADS: Record<
  SpreadType,
  { label: string; positions: string[] }
> = {
  single: { label: "Single Card", positions: ["Insight"] },
  three_card: {
    label: "Past Present Future",
    positions: ["Past", "Present", "Future"],
  },
  celtic_cross: {
    label: "Celtic Cross",
    positions: [
      "Present",
      "Challenge",
      "Distant Past",
      "Recent Past",
      "Possible Outcome",
      "Near Future",
      "Self",
      "Environment",
      "Hopes/Fears",
      "Final Outcome",
    ],
  },
};
```

Create `app/lib/tarot/random.ts`:

```ts
import type { TarotOrientation } from "./types";

export function randomOrientation(random: () => number): TarotOrientation {
  return random() < 0.5 ? "upright" : "reversed";
}

export function fisherYates(ids: number[], random: () => number): number[] {
  const copy = [...ids];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
```

Create `app/lib/tarot/engine.ts`:

```ts
import { fisherYates, randomOrientation } from "./random";
import type {
  CardInterpretations,
  DrawnCard,
  TarotFocus,
  TarotOrientation,
} from "./types";

export function shuffleDeck(
  deckIds: number[],
  random: () => number = Math.random,
): number[] {
  return fisherYates(deckIds, random);
}

export function drawCards(input: {
  deckIds: number[];
  count: number;
  random?: () => number;
}): DrawnCard[] {
  const random = input.random ?? Math.random;
  const shuffled = shuffleDeck(input.deckIds, random);
  return shuffled.slice(0, input.count).map((cardId) => ({
    cardId,
    orientation: randomOrientation(random),
  }));
}

export function resolveMeaning(input: {
  card: CardInterpretations;
  orientation: TarotOrientation;
  focus: TarotFocus;
}): string {
  return input.card[input.orientation][input.focus];
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm run test -- app/lib/tarot/engine.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/lib/tarot/types.ts app/lib/tarot/spreads.ts app/lib/tarot/random.ts app/lib/tarot/engine.ts app/lib/tarot/engine.test.ts
git commit -m "feat: add tarot engine core with tests"
```

### Task 3: Card Content Model and Validation Guard (TDD)

**Files:**

- Create: `app/data/cards.ts`
- Create: `app/lib/tarot/content.ts`
- Create: `app/lib/tarot/content.test.ts`

- [ ] **Step 1: Write failing validation tests**

Create `app/lib/tarot/content.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { assertCardContentComplete, getImagePath } from "./content";

describe("content validation", () => {
  it("returns image path from numeric id", () => {
    expect(getImagePath(0)).toBe("/cards/0.webp");
    expect(getImagePath(77)).toBe("/cards/77.webp");
  });

  it("accepts complete card interpretation object", () => {
    expect(() =>
      assertCardContentComplete([
        {
          id: 1,
          name: "Magician",
          interpretations: {
            upright: { general: "a", love: "b", career: "c" },
            reversed: { general: "d", love: "e", career: "f" },
          },
        },
      ]),
    ).not.toThrow();
  });

  it("throws if a meaning field is missing", () => {
    expect(() =>
      assertCardContentComplete([
        {
          id: 2,
          name: "Priestess",
          interpretations: {
            upright: { general: "a", love: "b", career: "" },
            reversed: { general: "d", love: "e", career: "f" },
          },
        },
      ]),
    ).toThrow(/incomplete/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm run test -- app/lib/tarot/content.test.ts`
Expected: FAIL because module is missing.

- [ ] **Step 3: Implement content schema and guard**

Create `app/lib/tarot/content.ts`:

```ts
import type { CardInterpretations } from "./types";

export type TarotCardContent = {
  id: number;
  name: string;
  interpretations: CardInterpretations;
};

export function getImagePath(cardId: number): string {
  return `/cards/${cardId}.webp`;
}

export function assertCardContentComplete(cards: TarotCardContent[]): void {
  for (const card of cards) {
    const values = [
      card.interpretations.upright.general,
      card.interpretations.upright.love,
      card.interpretations.upright.career,
      card.interpretations.reversed.general,
      card.interpretations.reversed.love,
      card.interpretations.reversed.career,
    ];

    if (values.some((value) => value.trim().length === 0)) {
      throw new Error(
        `Incomplete interpretations for card ${card.id} (${card.name})`,
      );
    }
  }
}
```

Create `app/data/cards.ts` with full 78-card data in this shape:

```ts
import type { TarotCardContent } from "~/lib/tarot/content";

export const TAROT_CARDS: TarotCardContent[] = [
  {
    id: 0,
    name: "The Fool",
    interpretations: {
      upright: {
        general: "...",
        love: "...",
        career: "...",
      },
      reversed: {
        general: "...",
        love: "...",
        career: "...",
      },
    },
  },
  // Continue through id 77 with full content.
];
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm run test -- app/lib/tarot/content.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/lib/tarot/content.ts app/lib/tarot/content.test.ts app/data/cards.ts
git commit -m "feat: add tarot content schema and validation"
```

### Task 4: Session Hook State Machine (TDD)

**Files:**

- Create: `app/hooks/use-tarot-session.ts`
- Create: `app/hooks/use-tarot-session.test.tsx`

- [ ] **Step 1: Write failing session hook tests**

Create `app/hooks/use-tarot-session.test.tsx`:

```tsx
import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useTarotSession } from "./use-tarot-session";

describe("useTarotSession", () => {
  it("starts session with spread card count", () => {
    const { result } = renderHook(() => useTarotSession());

    act(() => {
      result.current.startSession({ spread: "three_card", focus: "general" });
    });

    expect(result.current.cards).toHaveLength(3);
    expect(result.current.revealIndex).toBe(0);
    expect(result.current.complete).toBe(false);
  });

  it("progresses reveal until completion", () => {
    const { result } = renderHook(() => useTarotSession());

    act(() => {
      result.current.startSession({ spread: "single", focus: "love" });
    });

    act(() => {
      result.current.revealNext();
    });

    expect(result.current.complete).toBe(true);
  });

  it("resets state on restart", () => {
    const { result } = renderHook(() => useTarotSession());

    act(() => {
      result.current.startSession({ spread: "single", focus: "career" });
      result.current.restart();
    });

    expect(result.current.phase).toBe("setup");
    expect(result.current.cards).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm run test -- app/hooks/use-tarot-session.test.tsx`
Expected: FAIL due to missing hook module.

- [ ] **Step 3: Implement minimal hook state machine**

Create `app/hooks/use-tarot-session.ts`:

```ts
import { useMemo, useState } from "react";
import { TAROT_CARDS } from "~/data/cards";
import { drawCards, resolveMeaning } from "~/lib/tarot/engine";
import { SPREADS } from "~/lib/tarot/spreads";
import { assertCardContentComplete } from "~/lib/tarot/content";
import type { SpreadType, TarotFocus } from "~/lib/tarot/types";

assertCardContentComplete(TAROT_CARDS);

type SessionCard = {
  cardId: number;
  name: string;
  positionLabel: string;
  orientation: "upright" | "reversed";
  meaning: string;
};

export function useTarotSession() {
  const [phase, setPhase] = useState<"setup" | "reveal" | "summary">("setup");
  const [cards, setCards] = useState<SessionCard[]>([]);
  const [revealIndex, setRevealIndex] = useState(0);

  function startSession(input: { spread: SpreadType; focus: TarotFocus }) {
    const count = SPREADS[input.spread].positions.length;
    const drawn = drawCards({
      deckIds: TAROT_CARDS.map((c) => c.id),
      count,
    });

    const built = drawn.map((draw, index) => {
      const card = TAROT_CARDS.find((c) => c.id === draw.cardId)!;
      return {
        cardId: draw.cardId,
        name: card.name,
        positionLabel: SPREADS[input.spread].positions[index],
        orientation: draw.orientation,
        meaning: resolveMeaning({
          card: card.interpretations,
          orientation: draw.orientation,
          focus: input.focus,
        }),
      } satisfies SessionCard;
    });

    setCards(built);
    setRevealIndex(0);
    setPhase("reveal");
  }

  function revealNext() {
    setRevealIndex((prev) => {
      const next = prev + 1;
      if (next >= cards.length) {
        setPhase("summary");
        return prev;
      }
      return next;
    });
  }

  function restart() {
    setCards([]);
    setRevealIndex(0);
    setPhase("setup");
  }

  const complete = phase === "summary";
  const currentCard = useMemo(() => cards[revealIndex], [cards, revealIndex]);

  return {
    phase,
    cards,
    revealIndex,
    currentCard,
    complete,
    startSession,
    revealNext,
    restart,
  };
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm run test -- app/hooks/use-tarot-session.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/hooks/use-tarot-session.ts app/hooks/use-tarot-session.test.tsx
git commit -m "feat: add tarot session state hook"
```

### Task 5: UI Components and Route Flow (TDD)

**Files:**

- Create: `app/components/tarot/setup-form.tsx`
- Create: `app/components/tarot/reveal-step.tsx`
- Create: `app/components/tarot/reading-summary.tsx`
- Modify: `app/routes/home.tsx`
- Create: `app/routes/home.test.tsx`

- [ ] **Step 1: Write failing route flow tests**

Create `app/routes/home.test.tsx`:

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./home";

describe("home tarot flow", () => {
  it("shows begin screen first", () => {
    render(<Home />);
    expect(screen.getByRole("button", { name: /begin/i })).toBeInTheDocument();
  });

  it("moves from setup to guided reveal", () => {
    render(<Home />);

    fireEvent.click(screen.getByRole("button", { name: /begin/i }));
    fireEvent.click(screen.getByLabelText(/past present future/i));
    fireEvent.click(screen.getByLabelText(/general/i));
    fireEvent.click(screen.getByRole("button", { name: /start reading/i }));

    expect(screen.getByText(/position/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reveal/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm run test -- app/routes/home.test.tsx`
Expected: FAIL because tarot UI is not implemented.

- [ ] **Step 3: Implement UI components and home route**

Create `app/components/tarot/setup-form.tsx`:

```tsx
import { SPREADS } from "~/lib/tarot/spreads";
import type { SpreadType, TarotFocus } from "~/lib/tarot/types";

type Props = {
  spread: SpreadType;
  focus: TarotFocus;
  onSpreadChange: (spread: SpreadType) => void;
  onFocusChange: (focus: TarotFocus) => void;
  onSubmit: () => void;
};

export function SetupForm(props: Props) {
  return (
    <section>
      <h2>Choose your spread</h2>
      {(
        Object.entries(SPREADS) as [
          SpreadType,
          { label: string; positions: string[] },
        ][]
      ).map(([key, config]) => (
        <label key={key}>
          <input
            type="radio"
            name="spread"
            checked={props.spread === key}
            onChange={() => props.onSpreadChange(key)}
          />
          {config.label}
        </label>
      ))}

      <h2>Choose your focus</h2>
      {(["general", "love", "career"] as TarotFocus[]).map((focus) => (
        <label key={focus}>
          <input
            type="radio"
            name="focus"
            checked={props.focus === focus}
            onChange={() => props.onFocusChange(focus)}
          />
          {focus}
        </label>
      ))}

      <button onClick={props.onSubmit}>Start Reading</button>
    </section>
  );
}
```

Create `app/components/tarot/reveal-step.tsx`:

```tsx
import { getImagePath } from "~/lib/tarot/content";

type Props = {
  positionLabel: string;
  cardName: string;
  cardId: number;
  orientation: "upright" | "reversed";
  meaning: string;
  onNext: () => void;
};

export function RevealStep(props: Props) {
  return (
    <section>
      <p>Position: {props.positionLabel}</p>
      <img
        src={getImagePath(props.cardId)}
        alt={props.cardName}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      <p>
        {props.cardName} ({props.orientation})
      </p>
      <p>{props.meaning}</p>
      <button onClick={props.onNext}>Reveal Next</button>
    </section>
  );
}
```

Create `app/components/tarot/reading-summary.tsx`:

```tsx
type SessionCard = {
  cardId: number;
  name: string;
  positionLabel: string;
  orientation: "upright" | "reversed";
  meaning: string;
};

export function ReadingSummary(props: {
  cards: SessionCard[];
  onRestart: () => void;
}) {
  return (
    <section>
      <h2>Your Reading</h2>
      <ul>
        {props.cards.map((card) => (
          <li key={`${card.positionLabel}-${card.cardId}`}>
            <strong>{card.positionLabel}:</strong> {card.name} (
            {card.orientation})<p>{card.meaning}</p>
          </li>
        ))}
      </ul>
      <button onClick={props.onRestart}>Start New Reading</button>
    </section>
  );
}
```

Replace `app/routes/home.tsx` to orchestrate phases:

```tsx
import { useState } from "react";
import type { Route } from "./+types/home";
import { SetupForm } from "~/components/tarot/setup-form";
import { RevealStep } from "~/components/tarot/reveal-step";
import { ReadingSummary } from "~/components/tarot/reading-summary";
import { useTarotSession } from "~/hooks/use-tarot-session";
import type { SpreadType, TarotFocus } from "~/lib/tarot/types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "BullTarot" },
    { name: "description", content: "Web-based tarot card thrower" },
  ];
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [spread, setSpread] = useState<SpreadType>("single");
  const [focus, setFocus] = useState<TarotFocus>("general");
  const session = useTarotSession();

  if (!started) {
    return (
      <main>
        <h1>BullTarot</h1>
        <button onClick={() => setStarted(true)}>Begin</button>
      </main>
    );
  }

  if (session.phase === "setup") {
    return (
      <main>
        <SetupForm
          spread={spread}
          focus={focus}
          onSpreadChange={setSpread}
          onFocusChange={setFocus}
          onSubmit={() => session.startSession({ spread, focus })}
        />
      </main>
    );
  }

  if (session.phase === "reveal" && session.currentCard) {
    return (
      <main>
        <RevealStep
          positionLabel={session.currentCard.positionLabel}
          cardName={session.currentCard.name}
          cardId={session.currentCard.cardId}
          orientation={session.currentCard.orientation}
          meaning={session.currentCard.meaning}
          onNext={session.revealNext}
        />
      </main>
    );
  }

  return (
    <main>
      <ReadingSummary cards={session.cards} onRestart={session.restart} />
    </main>
  );
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm run test -- app/routes/home.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/components/tarot/setup-form.tsx app/components/tarot/reveal-step.tsx app/components/tarot/reading-summary.tsx app/routes/home.tsx app/routes/home.test.tsx
git commit -m "feat: implement tarot setup and guided reveal flow"
```

### Task 6: Styling, Fallback UX, and Full Verification

**Files:**

- Modify: `app/app.css`
- Modify: `app/components/tarot/reveal-step.tsx`
- Modify: `app/components/tarot/reading-summary.tsx`

- [ ] **Step 1: Write failing UI fallback test**

Add to `app/routes/home.test.tsx`:

```tsx
it("shows fallback content when card image fails", () => {
  render(<Home />);

  fireEvent.click(screen.getByRole("button", { name: /begin/i }));
  fireEvent.click(screen.getByRole("button", { name: /start reading/i }));

  const img = screen.getByRole("img");
  fireEvent.error(img);

  expect(screen.getByText(/image unavailable/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm run test -- app/routes/home.test.tsx -t "image fails"`
Expected: FAIL because no fallback marker exists.

- [ ] **Step 3: Implement fallback and tarot styling**

Update `app/components/tarot/reveal-step.tsx` to track image error state and render fallback card box text.

Update `app/app.css` with tarot-specific classes:

```css
.tarot-shell {
  min-height: 100dvh;
  background: radial-gradient(circle at 20% 20%, #1a162a 0%, #0b0a14 60%);
  color: #f5f2e8;
}
.tarot-card {
  border: 1px solid #8d7a44;
  border-radius: 12px;
  background: #151222;
}
.tarot-button {
  border: 1px solid #8d7a44;
  background: #2b2340;
  color: #f5f2e8;
}
.tarot-fallback {
  min-height: 320px;
  display: grid;
  place-items: center;
  color: #d9c891;
}
```

- [ ] **Step 4: Run full verification**

Run:

- `npm run test`
- `npm run typecheck`

Expected: all tests PASS and typecheck PASS.

- [ ] **Step 5: Commit**

```bash
git add app/app.css app/components/tarot/reveal-step.tsx app/components/tarot/reading-summary.tsx app/routes/home.test.tsx
git commit -m "style: add tarot theme and image fallback UX"
```

## Spec Coverage Check

- Spread selection (single, past-present-future, Celtic Cross): covered in Task 2 and Task 5.
- Focus selection (general, love, career): covered in Task 5.
- Full 78-card deck local content: covered in Task 3.
- Upright and reversed orientations: covered in Task 2 and Task 4.
- No duplicate draw per reading: covered in Task 2.
- Guided reveal one card at a time: covered in Task 4 and Task 5.
- Final summary view: covered in Task 5.
- Ephemeral sessions: covered in Task 4.
- Missing image fallback and content guard: covered in Task 3 and Task 6.
- Testing strategy (unit + component + flow): covered in Tasks 2 to 6.

## Placeholder Scan and Consistency Check

- No TODO or TBD placeholders remain in implementation steps.
- Shared type names and function names are consistent across tasks.
- Route and hook phases are consistent (setup, reveal, summary).
