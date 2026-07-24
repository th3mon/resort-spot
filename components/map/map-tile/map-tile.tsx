import Image from "next/image";

import type { PublicResortMapTile } from "@/domain/reservations";
import type { PathTileAsset } from "./map-tile-style";
import {
  TILE_ASSETS,
  tileClassName,
  tileImageClassName,
} from "./map-tile-style";

type MapTileProps = {
  tile: PublicResortMapTile;
  pathAsset: PathTileAsset | null;
  isSelected: boolean;
  onCabanaClick: (tile: PublicResortMapTile) => void;
};

export function MapTile({
  tile,
  pathAsset,
  isSelected,
  onCabanaClick,
}: MapTileProps) {
  const asset = pathAsset ?? TILE_ASSETS[tile.type];
  const label = tileLabel(tile);

  return tile.type === "cabana" ? (
    <CabanaTile
      tile={tile}
      assetSrc={asset.src}
      isSelected={isSelected}
      label={label}
      onCabanaClick={onCabanaClick}
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

type CabanaTileProps = {
  tile: PublicResortMapTile;
  assetSrc: string;
  isSelected: boolean;
  label: string;
  onCabanaClick: (tile: PublicResortMapTile) => void;
};

function CabanaTile({
  tile,
  assetSrc,
  isSelected,
  label,
  onCabanaClick,
}: CabanaTileProps) {
  const isAvailable = tile.availability === "available";
  const handleClick = (): void => onCabanaClick(tile);

  return (
    <button
      type="button"
      className={tileClassName(tile, isSelected)}
      aria-disabled={!isAvailable}
      onClick={handleClick}
      aria-pressed={isSelected}
      aria-label={label}
      title={label}
    >
      <TileImage src={assetSrc} tile={tile} />
    </button>
  );
}

type StaticMapTileProps = {
  tile: PublicResortMapTile;
  assetSrc: string;
  label: string;
  rotationClassName?: string;
};

function StaticMapTile({
  tile,
  assetSrc,
  label,
  rotationClassName,
}: StaticMapTileProps) {
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

type TileImageProps = {
  src: string;
  tile: PublicResortMapTile;
  rotationClassName?: string;
};

function TileImage({ src, tile, rotationClassName = "" }: TileImageProps) {
  return (
    <Image
      priority
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

  return `${tile.type} at row ${tile.y}, column ${tile.x}`;
}
