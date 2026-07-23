import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MapLegend } from "./map-legend";

describe("MapLegend", () => {
  it("renders every legend item including empty tiles", () => {
    render(<MapLegend />);

    const legend = screen.getByRole("complementary");

    expect(within(legend).getByText("Available")).toBeInTheDocument();
    expect(within(legend).getByText("Booked")).toBeInTheDocument();
    expect(within(legend).getByText("Pool")).toBeInTheDocument();
    expect(within(legend).getByText("Path")).toBeInTheDocument();
    expect(within(legend).getByText("Chalet")).toBeInTheDocument();
    expect(within(legend).getByText("Empty")).toBeInTheDocument();
  });
});
