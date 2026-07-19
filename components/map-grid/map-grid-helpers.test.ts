import { describe, expect, it } from "vitest";

import type { PublicResortMapTile } from "@/domain/reservations";

import {
  coordinateKey,
  isPathAt,
  pathConnectionsFor,
  tilesByCoordinateFor,
} from "@/components/map-grid";

describe("map grid helpers", () => {
  const pathConnectionTiles: PublicResortMapTile[] = [
    { id: "tile-1-0", x: 1, y: 0, symbol: "#", type: "path" },
    { id: "tile-0-1", x: 0, y: 1, symbol: "#", type: "path" },
    { id: "tile-1-1", x: 1, y: 1, symbol: "#", type: "path" },
    { id: "tile-2-1", x: 2, y: 1, symbol: "#", type: "path" },
    { id: "tile-1-2", x: 1, y: 2, symbol: "p", type: "pool" },
  ];

  it("creates stable coordinate keys", () => {
    expect(coordinateKey(3, 7)).toBe("3:7");
  });

  it("indexes tiles by coordinate", () => {
    const tilesByCoordinate = tilesByCoordinateFor(pathConnectionTiles);

    expect(tilesByCoordinate.get("1:1")).toMatchObject({
      id: "tile-1-1",
      type: "path",
    });
    expect(tilesByCoordinate.get("1:2")).toMatchObject({
      id: "tile-1-2",
      type: "pool",
    });
  });

  it("returns true only for path tiles at the requested coordinate", () => {
    const tilesByCoordinate = tilesByCoordinateFor(pathConnectionTiles);

    expect(isPathAt(1, 1, tilesByCoordinate)).toBe(true);
    expect(isPathAt(1, 2, tilesByCoordinate)).toBe(false);
    expect(isPathAt(9, 9, tilesByCoordinate)).toBe(false);
  });

  it("detects neighboring path tiles for path asset selection", () => {
    const tilesByCoordinate = tilesByCoordinateFor(pathConnectionTiles);
    const centerPath = pathConnectionTiles.find(tile => tile.id === "tile-1-1");

    if (!centerPath) {
      throw new Error("Expected center path fixture to exist.");
    }

    expect(pathConnectionsFor(centerPath, tilesByCoordinate)).toEqual({
      north: true,
      east: true,
      south: false,
      west: true,
    });
  });
});
