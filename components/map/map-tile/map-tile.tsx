import Image from "next/image";

import {
  type PathTileAsset,
  tileClassName,
  tileImageClassName,
  TILE_ASSETS,
} from "@/components/map/map-tile";
import type { PublicResortMapTile } from "@/domain/reservations";

type MapTileProps = {
  tile: PublicResortMapTile;
  pathAsset: PathTileAsset | null;
  isSelected: boolean;
  onSelectCabana: (cabanaId: string) => void;
};

export function MapTile({
  tile,
  pathAsset,
  isSelected,
  onSelectCabana,
}: MapTileProps) {
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

type CabanaTileProps = {
  tile: PublicResortMapTile;
  assetSrc: string;
  isSelected: boolean;
  label: string;
  onSelectCabana: (cabanaId: string) => void;
};

function CabanaTile({
  tile,
  assetSrc,
  isSelected,
  label,
  onSelectCabana,
}: CabanaTileProps) {
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
