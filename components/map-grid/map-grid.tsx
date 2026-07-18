import { MapTile } from "@/components/map-tile";
import { pathTileAssetFor } from "@/components/map-tile-style";
import type { PublicResortMap } from "@/domain/reservations";

import {
  tilesByCoordinateFor,
  pathConnectionsFor,
} from "@/components/map-grid";

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
