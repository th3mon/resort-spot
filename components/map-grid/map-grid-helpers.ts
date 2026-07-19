import type { PublicResortMapTile } from "@/domain/reservations";

export type PathConnections = {
  north: boolean;
  east: boolean;
  south: boolean;
  west: boolean;
};

export const coordinateKey = (x: number, y: number): string => `${x}:${y}`;

export const isPathAt = (
  x: number,
  y: number,
  tilesByCoordinate: Map<string, PublicResortMapTile>,
): boolean => tilesByCoordinate.get(coordinateKey(x, y))?.type === "path";

export const tilesByCoordinateFor = (
  tiles: PublicResortMapTile[],
): Map<string, PublicResortMapTile> =>
  new Map(tiles.map(tile => [coordinateKey(tile.x, tile.y), tile]));

export const pathConnectionsFor = (
  tile: PublicResortMapTile,
  tilesByCoordinate: Map<string, PublicResortMapTile>,
): PathConnections => ({
  north: isPathAt(tile.x, tile.y - 1, tilesByCoordinate),
  east: isPathAt(tile.x + 1, tile.y, tilesByCoordinate),
  south: isPathAt(tile.x, tile.y + 1, tilesByCoordinate),
  west: isPathAt(tile.x - 1, tile.y, tilesByCoordinate),
});
