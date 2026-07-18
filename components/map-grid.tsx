import { MapTile } from "@/components/map-tile";
import { pathTileAssetFor } from "@/components/map-tile-style";
import type {
  PublicResortMap,
  PublicResortMapTile,
} from "@/domain/reservations";

export function MapGrid({
  map,
  selectedCabanaId,
  onSelectCabana,
}: {
  map: PublicResortMap;
  selectedCabanaId: string | null;
  onSelectCabana: (cabanaId: string) => void;
}) {
  const tilesByCoordinate = tilesByCoordinateFor(map.tiles);

  return (
    <div className="overflow-auto rounded border border-[#c9d5ca] bg-[#e3eadf] p-3 shadow-sm justify-items-center">
      <div
        className="grid min-w-max gap-1"
        style={{
          gridAutoRows: "2.5rem",
          gridTemplateColumns: `repeat(${map.width}, 2.5rem)`,
        }}
      >
        {map.tiles.map(tile => (
          <MapTile
            key={tile.id}
            tile={tile}
            pathAsset={
              tile.type === "path"
                ? pathTileAssetFor(pathConnectionsFor(tile, tilesByCoordinate))
                : undefined
            }
            isSelected={selectedCabanaId === tile.id}
            onSelectCabana={onSelectCabana}
          />
        ))}
      </div>
    </div>
  );
}

const tilesByCoordinateFor = (
  tiles: PublicResortMapTile[],
): Map<string, PublicResortMapTile> =>
  new Map(tiles.map(tile => [coordinateKey(tile.x, tile.y), tile]));

// TODO: Create or use existing return type
const pathConnectionsFor = (
  tile: PublicResortMapTile,
  tilesByCoordinate: Map<string, PublicResortMapTile>,
) => ({
  north: isPathAt(tile.x, tile.y - 1, tilesByCoordinate),
  east: isPathAt(tile.x + 1, tile.y, tilesByCoordinate),
  south: isPathAt(tile.x, tile.y + 1, tilesByCoordinate),
  west: isPathAt(tile.x - 1, tile.y, tilesByCoordinate),
});

const isPathAt = (
  x: number,
  y: number,
  tilesByCoordinate: Map<string, PublicResortMapTile>,
): boolean => tilesByCoordinate.get(coordinateKey(x, y))?.type === "path";

const coordinateKey = (x: number, y: number): string => `${x}:${y}`;
