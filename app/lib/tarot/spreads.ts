import type { SpreadType } from "./types";

export const SPREADS: Record<
  SpreadType,
  { label: string; positions: string[] }
> = {
  single: {
    label: "1-card pull",
    positions: ["Insight"],
  },
  three_card: {
    label: "3-card Past / Present / Future",
    positions: ["Past", "Present", "Future"],
  },
  decision_spread: {
    label: "5-card Decision spread",
    positions: [
      "The Situation",
      "The Challenge",
      "Option A",
      "Option B",
      "Likely Outcome",
    ],
  },
  horseshoe: {
    label: "7-card Horseshoe",
    positions: [
      "Past",
      "Present",
      "Hidden Influences",
      "Obstacles",
      "Outside Support",
      "Action Advice",
      "Probable Outcome",
    ],
  },
  celtic_cross: {
    label: "10-card Celtic Cross",
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
