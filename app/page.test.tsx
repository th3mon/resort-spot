import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("Home", () => {
  it("renders the project skeleton landing content", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: /interactive resort map and cabana booking app/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/accepted through --map and --bookings/i),
    ).toBeInTheDocument();
  });
});
