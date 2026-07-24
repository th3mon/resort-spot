import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import Home from "./page";

describe("Home", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders the resort map shell", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {})),
    );

    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: /cabana map/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: /legend/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/loading map/i)).toBeInTheDocument();
  });
});
