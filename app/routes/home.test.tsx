import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import * as tarotContent from "~/lib/tarot/content";
import Home from "./home";

describe("Home route", () => {
  it("shows begin screen first", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: "BullTarot" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Begin" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Shuffle & Draw" }),
    ).not.toBeInTheDocument();
  });

  it("moves from setup to guided reveal after begin, selecting options, and start", () => {
    render(<Home />);

    fireEvent.click(screen.getByRole("button", { name: "Begin" }));

    expect(
      screen.getByRole("heading", { name: "Choose your spread" }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("radio", { name: /Past \/ Present \/ Future/i }),
    );
    fireEvent.click(screen.getByRole("radio", { name: /All cards/i }));
    fireEvent.click(screen.getByRole("radio", { name: /Career/i }));
    fireEvent.click(screen.getByRole("button", { name: "Shuffle & Draw" }));

    expect(
      screen.getByRole("region", { name: "Guided reveal" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Reveal card for Past/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reveal All" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "New Reading" }),
    ).toBeInTheDocument();
  });

  it("reveals a single-card reading and can start a new reading", () => {
    render(<Home />);

    fireEvent.click(screen.getByRole("button", { name: "Begin" }));

    expect(
      screen.getByRole("heading", { name: "Choose your spread" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("radio", { name: /General/i }));
    fireEvent.click(screen.getByRole("radio", { name: /All cards/i }));
    fireEvent.click(screen.getByRole("radio", { name: /1-card pull/i }));
    fireEvent.click(screen.getByRole("button", { name: "Shuffle & Draw" }));

    expect(
      screen.getByRole("region", { name: "Guided reveal" }),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: /Reveal card for Insight/i }),
    );

    expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: "Reveal All" }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "New Reading" }));

    expect(
      screen.getByRole("heading", { name: "Choose your spread" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Shuffle & Draw" }),
    ).toBeInTheDocument();
  });

  it("shows fallback text when a reveal card image fails to load", () => {
    render(<Home />);

    fireEvent.click(screen.getByRole("button", { name: "Begin" }));
    fireEvent.click(screen.getByRole("radio", { name: /1-card pull/i }));
    fireEvent.click(screen.getByRole("radio", { name: /General/i }));
    fireEvent.click(screen.getByRole("radio", { name: /All cards/i }));
    fireEvent.click(screen.getByRole("button", { name: "Shuffle & Draw" }));

    fireEvent.click(
      screen.getByRole("button", { name: /Reveal card for Insight/i }),
    );
    const revealImage = screen
      .getAllByRole("img")
      .find(
        (image) => !(image.getAttribute("alt") ?? "").startsWith("Card back"),
      );

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

    expect(
      screen.getByRole("heading", { name: "Choose your spread" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      /deck content incomplete/i,
    );

    integritySpy.mockRestore();
  });

  it("reveals celtic cross cards", () => {
    render(<Home />);

    fireEvent.click(screen.getByRole("button", { name: "Begin" }));

    expect(
      screen.getByRole("heading", { name: "Choose your spread" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("radio", { name: /Celtic Cross/i }));
    fireEvent.click(screen.getByRole("radio", { name: /All cards/i }));
    fireEvent.click(screen.getByRole("button", { name: "Shuffle & Draw" }));

    expect(
      screen.getByRole("region", { name: "Guided reveal" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Reveal All" }));
    expect(
      screen.queryByRole("button", { name: "Reveal All" }),
    ).not.toBeInTheDocument();
  });
});
