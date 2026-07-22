import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type {
  PublicResortMap,
  PublicResortMapTile,
} from "@/domain/reservations";

import { MapGrid } from "./map-grid";

describe("MapGrid", () => {
  it("renders cabanas with availability and calls the selection handler for available cabanas", async () => {
    const user = userEvent.setup();
    const onSelectCabana = vi.fn();
    const onUnavailableCabana = vi.fn();

    render(
      <MapGrid
        map={mapFixture}
        selectedCabanaId="cabana-0-0"
        onSelectCabana={onSelectCabana}
        onUnavailableCabana={onUnavailableCabana}
      />,
    );

    const availableCabana = screen.getByRole("button", {
      name: "cabana-0-0, available",
    });
    const reservedCabana = screen.getByRole("button", {
      name: "cabana-2-0, reserved",
    });

    expect(availableCabana).toBeEnabled();
    expect(availableCabana).toHaveAttribute("aria-pressed", "true");
    expect(reservedCabana).toBeEnabled();
    expect(reservedCabana).toHaveAttribute("aria-disabled", "true");

    await user.click(availableCabana);
    await user.click(reservedCabana);

    expect(onSelectCabana).toHaveBeenCalledTimes(1);
    expect(onSelectCabana).toHaveBeenCalledWith("cabana-0-0");
    expect(onUnavailableCabana).toHaveBeenCalledWith("cabana-2-0");
  });
});

const tile = (mapTile: PublicResortMapTile): PublicResortMapTile => mapTile;

const mapFixture: PublicResortMap = {
  width: 3,
  height: 2,
  tiles: [
    tile({
      id: "cabana-0-0",
      x: 0,
      y: 0,
      symbol: "W",
      type: "cabana",
      availability: "available",
    }),
    tile({ id: "tile-1-0", x: 1, y: 0, symbol: "#", type: "path" }),
    tile({
      id: "cabana-2-0",
      x: 2,
      y: 0,
      symbol: "W",
      type: "cabana",
      availability: "reserved",
    }),
    tile({ id: "tile-0-1", x: 0, y: 1, symbol: "p", type: "pool" }),
    tile({ id: "tile-1-1", x: 1, y: 1, symbol: "c", type: "chalet" }),
    tile({ id: "tile-2-1", x: 2, y: 1, symbol: ".", type: "empty" }),
  ],
};
