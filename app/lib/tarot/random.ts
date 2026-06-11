import type { TarotOrientation } from "./types";

const REVERSED_ORIENTATION_PROBABILITY = 0.25;

function nextRandom(random: () => number): number {
  const value = random();

  if (!Number.isFinite(value) || value < 0 || value >= 1) {
    throw new Error(
      `Invalid RNG output: ${String(value)}. Expected a finite number in the range [0, 1).`,
    );
  }

  return value;
}

export function randomOrientation(random: () => number): TarotOrientation {
  return nextRandom(random) < 1 - REVERSED_ORIENTATION_PROBABILITY
    ? "upright"
    : "reversed";
}

export function fisherYates(ids: number[], random: () => number): number[] {
  const copy = [...ids];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(nextRandom(random) * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}