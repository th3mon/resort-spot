import type { PublicResortMapTile } from "@/domain/reservations";
import { coordinateKey } from "@/components/map-grid";

export const tilesByCoordinateFor = (
  tiles: PublicResortMapTile[],
): Map<string, PublicResortMapTile> =>
  new Map(tiles.map(tile => [coordinateKey(tile.x, tile.y), tile]));
