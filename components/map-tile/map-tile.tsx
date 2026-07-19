import Image from "next/image";

import {
  type PathTileAsset,
  tileClassName,
  tileImageClassName,
  TILE_ASSETS,
} from "@/components/map-tile";
import type { PublicResortMapTile } from "@/domain/reservations";

export function MapTile({
  tile,
  pathAsset,
  isSelected,
  onSelectCabana,
}: {
  tile: PublicResortMapTile;
  pathAsset: PathTileAsset | null;
  isSelected: boolean;
  onSelectCabana: (cabanaId: string) => void;
}) {
  const asset = pathAsset ?? TILE_ASSETS[tile.type];
  const label = tileLabel(tile);

  return tile.type === "cabana" ? (
    <CabanaTile
      tile={tile}
      assetSrc={asset.src}
      isSelected={isSelected}
      label={label}
      onSelectCabana={onSelectCabana}
    />
  ) : (
    <StaticMapTile
      tile={tile}
      assetSrc={asset.src}
      label={label}
      rotationClassName={pathAsset?.rotationClassName}
    />
  );
}

function CabanaTile({
  tile,
  assetSrc,
  isSelected,
  label,
  onSelectCabana,
}: {
  tile: PublicResortMapTile;
  assetSrc: string;
  isSelected: boolean;
  label: string;
  onSelectCabana: (cabanaId: string) => void;
}) {
  const isAvailable = tile.availability === "available";

  return (
    <button
      type="button"
      className={tileClassName(tile, isSelected)}
      disabled={!isAvailable}
      onClick={() => onSelectCabana(tile.id)}
      aria-pressed={isSelected}
      aria-label={label}
      title={label}
    >
      <TileImage src={assetSrc} tile={tile} />
    </button>
  );
}

function StaticMapTile({
  tile,
  assetSrc,
  label,
  rotationClassName,
}: {
  tile: PublicResortMapTile;
  assetSrc: string;
  label: string;
  rotationClassName?: string;
}) {
  return (
    <div
      className={tileClassName(tile, false)}
      aria-label={label}
      title={label}
    >
      <TileImage
        src={assetSrc}
        tile={tile}
        rotationClassName={rotationClassName}
      />
    </div>
  );
}

function TileImage({
  src,
  tile,
  rotationClassName = "",
}: {
  src: string;
  tile: PublicResortMapTile;
  rotationClassName?: string;
}) {
  return (
    <Image
      src={src}
      alt=""
      width={64}
      height={64}
      className={`${tileImageClassName(tile)} ${rotationClassName}`}
    />
  );
}

function tileLabel(tile: PublicResortMapTile): string {
  if (tile.type === "cabana") {
    return `${tile.id}, ${tile.availability ?? "unknown"}`;
  }

  return `${tile.type} at row ${tile.y + 1}, column ${tile.x + 1}`;
}
