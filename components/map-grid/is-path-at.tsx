import type { PublicResortMapTile } from "@/domain/reservations";
import { coordinateKey } from "@/components/map-grid";

export const isPathAt = (
  x: number,
  y: number,
  tilesByCoordinate: Map<string, PublicResortMapTile>,
): boolean => tilesByCoordinate.get(coordinateKey(x, y))?.type === "path";
