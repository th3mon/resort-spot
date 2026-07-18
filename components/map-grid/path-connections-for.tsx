import type { PublicResortMapTile } from "@/domain/reservations";
import { isPathAt, PathConnections } from "@/components/map-grid";

export const pathConnectionsFor = (
  tile: PublicResortMapTile,
  tilesByCoordinate: Map<string, PublicResortMapTile>,
): PathConnections => ({
  north: isPathAt(tile.x, tile.y - 1, tilesByCoordinate),
  east: isPathAt(tile.x + 1, tile.y, tilesByCoordinate),
  south: isPathAt(tile.x, tile.y + 1, tilesByCoordinate),
  west: isPathAt(tile.x - 1, tile.y, tilesByCoordinate),
});
