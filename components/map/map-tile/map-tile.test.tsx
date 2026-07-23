import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { PublicResortMapTile } from "@/domain/reservations";

import { MapTile } from "./map-tile";
import type { PathTileAsset } from "./map-tile-style";

describe("MapTile", () => {
  it("renders an available cabana as a selectable button", async () => {
    const user = userEvent.setup();
    const onCabanaClick = vi.fn();

    render(
      <MapTile
        tile={availableCabanaTile}
        pathAsset={null}
        isSelected={true}
        onCabanaClick={onCabanaClick}
      />,
    );

    const cabana = screen.getByRole("button", {
      name: "cabana-2-3, available",
    });

    expect(cabana).toBeEnabled();
    expect(cabana).toHaveAttribute("aria-pressed", "true");
    expect(cabana).toHaveAttribute("title", "cabana-2-3, available");

    await user.click(cabana);

    expect(onCabanaClick).toHaveBeenCalledTimes(1);
    expect(onCabanaClick).toHaveBeenCalledWith(availableCabanaTile);
  });

  it("reports a reserved cabana click", async () => {
    const user = userEvent.setup();
    const onCabanaClick = vi.fn();

    render(
      <MapTile
        tile={reservedCabanaTile}
        pathAsset={null}
        isSelected={false}
        onCabanaClick={onCabanaClick}
      />,
    );

    const cabana = screen.getByRole("button", {
      name: "cabana-4-1, reserved",
    });

    expect(cabana).toBeEnabled();
    expect(cabana).toHaveAttribute("aria-disabled", "true");
    expect(cabana).toHaveAttribute("aria-pressed", "false");

    await user.click(cabana);

    expect(onCabanaClick).toHaveBeenCalledWith(reservedCabanaTile);
  });

  it("renders non-cabana tiles with coordinate labels and path asset rotation", () => {
    render(
      <MapTile
        tile={pathTile}
        pathAsset={rotatedPathAsset}
        isSelected={false}
        onCabanaClick={vi.fn()}
      />,
    );

    const path = screen.getByLabelText("path at row 1, column 2");
    const image = path.querySelector("img");

    expect(path).toHaveAttribute("title", "path at row 1, column 2");
    expect(image).toHaveClass("rotate-90");
  });

  it("renders empty tile with coordinate labels", () => {
    render(
      <MapTile
        tile={emptyTile}
        pathAsset={null}
        isSelected={false}
        onCabanaClick={vi.fn()}
      />,
    );

    const path = screen.getByLabelText("empty at row 7, column 9");

    expect(path).toHaveAttribute("title", "empty at row 7, column 9");
  });
});

const availableCabanaTile: PublicResortMapTile = Object.freeze({
  id: "cabana-2-3",
  x: 2,
  y: 3,
  symbol: "W",
  type: "cabana",
  availability: "available",
} satisfies PublicResortMapTile);

const reservedCabanaTile: PublicResortMapTile = Object.freeze({
  id: "cabana-4-1",
  x: 4,
  y: 1,
  symbol: "W",
  type: "cabana",
  availability: "reserved",
} satisfies PublicResortMapTile);

const pathTile: PublicResortMapTile = Object.freeze({
  id: "tile-2-1",
  x: 2,
  y: 1,
  symbol: "#",
  type: "path",
} satisfies PublicResortMapTile);

const rotatedPathAsset: PathTileAsset = Object.freeze({
  src: "/assets/arrowStraight.png",
  alt: "Straight path",
  rotationClassName: "rotate-90",
} satisfies PathTileAsset);

const emptyTile: PublicResortMapTile = Object.freeze({
  id: "tile-9-7",
  x: 9,
  y: 7,
  symbol: ".",
  type: "empty",
} satisfies PublicResortMapTile);
