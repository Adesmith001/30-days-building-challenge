import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import App from "@/app";
import { useGameStore } from "@/store/use-game-store";

afterEach(cleanup);

describe("application navigation", () => {
  beforeEach(() => {
    localStorage.clear();
    useGameStore.setState({
      view: "landing",
      run: null,
      history: [],
      shift: null,
      completedShift: null,
    });
  });

  it("opens the incident library from the landing page", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /incident library/i }));
    expect(screen.getByText("INCIDENT LIBRARY")).toBeInTheDocument();
  });

  it("opens the how-it-works guide from the landing page", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /how it works/i }));
    expect(screen.getByText("INCIDENT RESPONSE 101")).toBeInTheDocument();
  });
});
