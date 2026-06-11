import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import * as tarotContent from "~/lib/tarot/content";
import { TAROT_CARDS } from "~/data/cards";
import Home from "./home";

const DAILY_PULL_STORAGE_KEY = "bulltarot:daily-pull:single";

function getLocalDateStamp(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, "0");
  const day = `${today.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

describe("Home route", () => {
  it("shows begin screen first", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { name: "BullTarot" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Begin" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Shuffle & Draw" })).not.toBeInTheDocument();
  });

  it("moves from setup to guided reveal after begin, selecting options, and start", () => {
    render(<Home />);

    fireEvent.click(screen.getByRole("button", { name: "Begin" }));

    expect(screen.getByRole("heading", { name: "Choose your spread" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("radio", { name: /Past Present Future/i }));
    fireEvent.click(screen.getByRole("radio", { name: "All cards" }));
    fireEvent.click(screen.getByRole("radio", { name: "Career" }));
    fireEvent.click(screen.getByRole("button", { name: "Shuffle & Draw" }));

    expect(screen.getByRole("region", { name: "Guided reveal" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reveal card for Past/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reveal All" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Finish Reading" })).toBeDisabled();
  });

  it("completes a single-card reading, shows summary, and restarts to setup", () => {
    render(<Home />);

    fireEvent.click(screen.getByRole("button", { name: "Begin" }));

    expect(screen.getByRole("heading", { name: "Choose your spread" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("radio", { name: "General" }));
    fireEvent.click(screen.getByRole("radio", { name: "All cards" }));
    fireEvent.click(screen.getByRole("radio", { name: /1-card daily pull/i }));
    fireEvent.click(screen.getByRole("button", { name: "Shuffle & Draw" }));

    expect(screen.getByRole("region", { name: "Guided reveal" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Reveal card for Insight/i }));
    expect(screen.getByRole("button", { name: "Finish Reading" })).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: "Finish Reading" }));

    expect(screen.getByRole("heading", { name: "Reading Summary" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Reading summary" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Start New Reading" }));

    expect(screen.getByRole("heading", { name: "Choose your spread" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Shuffle & Draw" })).toBeInTheDocument();
  });

  it("auto-reveals an already redeemed single daily pull", () => {
    localStorage.setItem(
      DAILY_PULL_STORAGE_KEY,
      JSON.stringify({
        date: getLocalDateStamp(),
        deckScope: "all_cards",
        cardId: TAROT_CARDS[0].id,
        orientation: "upright",
      }),
    );

    render(<Home />);

    fireEvent.click(screen.getByRole("button", { name: "Begin" }));
    fireEvent.click(screen.getByRole("radio", { name: /1-card daily pull/i }));
    fireEvent.click(screen.getByRole("radio", { name: "General" }));
    fireEvent.click(screen.getByRole("radio", { name: "All cards" }));
    fireEvent.click(screen.getByRole("button", { name: "Shuffle & Draw" }));

    expect(
      screen.getByText(/daily pull already redeemed for today/i),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Reveal card for/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Reveal All" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Finish Reading" })).toBeEnabled();
  });

  it("shows fallback text when a reveal card image fails to load", () => {
    render(<Home />);

    fireEvent.click(screen.getByRole("button", { name: "Begin" }));
    fireEvent.click(screen.getByRole("radio", { name: /1-card daily pull/i }));
    fireEvent.click(screen.getByRole("radio", { name: "General" }));
    fireEvent.click(screen.getByRole("radio", { name: "All cards" }));
    fireEvent.click(screen.getByRole("button", { name: "Shuffle & Draw" }));

    fireEvent.click(screen.getByRole("button", { name: /Reveal card for Insight/i }));
    const revealImage = screen
      .getAllByRole("img")
      .find((image) => !(image.getAttribute("alt") ?? "").startsWith("Card back"));

    expect(revealImage).toBeDefined();
    if (!revealImage) {
      return;
    }

    fireEvent.error(revealImage);

    expect(screen.getByText("Image unavailable")).toBeInTheDocument();
  });

  it("keeps setup visible and shows deck content incomplete error when deck validation fails", () => {
    const integritySpy = vi
      .spyOn(tarotContent, "assertCardContentComplete")
      .mockImplementation(() => {
        throw new Error("broken");
      });

    render(<Home />);

    fireEvent.click(screen.getByRole("button", { name: "Begin" }));
    fireEvent.click(screen.getByRole("button", { name: "Shuffle & Draw" }));

    expect(screen.getByRole("heading", { name: "Choose your spread" })).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(/deck content incomplete/i);

    integritySpy.mockRestore();
  });

  it("completes celtic cross flow from setup to summary", () => {
    render(<Home />);

    fireEvent.click(screen.getByRole("button", { name: "Begin" }));

    expect(screen.getByRole("heading", { name: "Choose your spread" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("radio", { name: "Celtic Cross" }));
    fireEvent.click(screen.getByRole("radio", { name: "All cards" }));
    fireEvent.click(screen.getByRole("button", { name: "Shuffle & Draw" }));

    expect(screen.getByRole("region", { name: "Guided reveal" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Reveal All" }));
    fireEvent.click(screen.getByRole("button", { name: "Finish Reading" }));

    expect(screen.getByRole("heading", { name: "Reading Summary" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Reading summary" })).toBeInTheDocument();
  });
});
