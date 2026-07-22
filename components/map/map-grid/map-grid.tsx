import { MapTile } from "@/components/map/map-tile";
import { pathTileAssetFor } from "@/components/map/map-tile/map-tile-style";
import type { PublicResortMap } from "@/domain/reservations";

import { pathConnectionsFor, tilesByCoordinateFor } from "./map-grid-helpers";

type MapGridProps = {
  map: PublicResortMap;
  selectedCabanaId: string | null;
  onSelectCabana: (cabanaId: string) => void;
};

export function MapGrid({
  map,
  selectedCabanaId,
  onSelectCabana,
}: MapGridProps) {
  const tilesByCoordinate = tilesByCoordinateFor(map.tiles);
  const tileSize = "2.5rem";
  const mapGridStyle: React.CSSProperties = {
    gridAutoRows: tileSize,
    gridTemplateColumns: `repeat(${map.width}, ${tileSize})`,
  };

  return (
    <div className="overflow-auto rounded border border-[#c9d5ca] bg-[#e3eadf] p-3 shadow-sm justify-items-center">
      <div className="grid min-w-max gap-1" style={mapGridStyle}>
        {map.tiles.map(tile => (
          <MapTile
            key={tile.id}
            tile={tile}
            pathAsset={
              tile.type === "path"
                ? pathTileAssetFor(pathConnectionsFor(tile, tilesByCoordinate))
                : null
            }
            isSelected={selectedCabanaId === tile.id}
            onSelectCabana={onSelectCabana}
          />
        ))}
      </div>
    </div>
  );
}
