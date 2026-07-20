import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { PublicResortMapTile } from "@/domain/reservations";

import { MapTile } from "./map-tile";
import type { PathTileAsset } from "./map-tile-style";

describe("MapTile", () => {
  it("renders an available cabana as a selectable button", async () => {
    const user = userEvent.setup();
    const onSelectCabana = vi.fn();

    render(
      <MapTile
        tile={availableCabana}
        pathAsset={null}
        isSelected={true}
        onSelectCabana={onSelectCabana}
      />,
    );

    const cabana = screen.getByRole("button", {
      name: "cabana-2-3, available",
    });

    expect(cabana).toBeEnabled();
    expect(cabana).toHaveAttribute("aria-pressed", "true");
    expect(cabana).toHaveAttribute("title", "cabana-2-3, available");

    await user.click(cabana);

    expect(onSelectCabana).toHaveBeenCalledTimes(1);
    expect(onSelectCabana).toHaveBeenCalledWith("cabana-2-3");
  });

  it("renders a reserved cabana as disabled and does not select it", async () => {
    const user = userEvent.setup();
    const onSelectCabana = vi.fn();

    render(
      <MapTile
        tile={reservedCabana}
        pathAsset={null}
        isSelected={false}
        onSelectCabana={onSelectCabana}
      />,
    );

    const cabana = screen.getByRole("button", {
      name: "cabana-4-1, reserved",
    });

    expect(cabana).toBeDisabled();
    expect(cabana).toHaveAttribute("aria-pressed", "false");

    await user.click(cabana);

    expect(onSelectCabana).not.toHaveBeenCalled();
  });

  it("renders non-cabana tiles with coordinate labels and path asset rotation", () => {
    render(
      <MapTile
        tile={pathTile}
        pathAsset={rotatedPathAsset}
        isSelected={false}
        onSelectCabana={vi.fn()}
      />,
    );

    const path = screen.getByLabelText("path at row 2, column 3");
    const image = path.querySelector("img");

    expect(path).toHaveAttribute("title", "path at row 2, column 3");
    expect(image).toHaveClass("rotate-90");
  });
});

const availableCabana: PublicResortMapTile = Object.freeze({
  id: "cabana-2-3",
  x: 2,
  y: 3,
  symbol: "W",
  type: "cabana",
  availability: "available",
} satisfies PublicResortMapTile);

const reservedCabana: PublicResortMapTile = Object.freeze({
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
