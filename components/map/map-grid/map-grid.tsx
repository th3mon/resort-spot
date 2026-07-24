import { MapTile } from "@/components/map/map-tile";
import { pathTileAssetFor } from "@/components/map/map-tile/map-tile-style";
import type {
  PublicResortMap,
  PublicResortMapTile,
} from "@/domain/reservations";

import { pathConnectionsFor, tilesByCoordinateFor } from "./map-grid-helpers";

type MapGridProps = {
  map: PublicResortMap;
  selectedCabanaId: string | null;
  onCabanaClick: (tile: PublicResortMapTile) => void;
};

export function MapGrid({
  map,
  selectedCabanaId,
  onCabanaClick,
}: MapGridProps) {
  const tilesByCoordinate = tilesByCoordinateFor(map.tiles);
  const tileSize = "2.5rem";
  const mapGridStyle: React.CSSProperties = {
    gridAutoRows: tileSize,
    gridTemplateColumns: `repeat(${map.width}, ${tileSize})`,
  };

  return (
    <div className="map-grid ui-enter justify-items-center rounded border border-(--color-border-muted) bg-(--color-surface-map) p-4 shadow-md shadow-(color:--color-shadow-soft)">
      <div
        className="map-grid__tiles grid min-w-max gap-1.5"
        style={mapGridStyle}
      >
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
            onCabanaClick={onCabanaClick}
          />
        ))}
      </div>
    </div>
  );
}
