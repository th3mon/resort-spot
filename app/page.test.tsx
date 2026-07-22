import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("Home", () => {
  it("renders the resort map shell", () => {
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
