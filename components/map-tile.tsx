import Image from "next/image";

import {
  tileClassName,
  tileImageClassName,
  TILE_ASSETS,
} from "@/components/map-tile-style";
import type { PublicResortMapTile } from "@/domain/reservations";

export function MapTile({
  tile,
  isSelected,
  onSelectCabana,
}: {
  tile: PublicResortMapTile;
  isSelected: boolean;
  onSelectCabana: (cabanaId: string) => void;
}) {
  const asset = TILE_ASSETS[tile.type];
  const label = tileLabel(tile);

  if (tile.type === "cabana") {
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
        <TileImage src={asset.src} tile={tile} />
      </button>
    );
  }

  return (
    <div
      className={tileClassName(tile, false)}
      aria-label={label}
      title={label}
    >
      <TileImage src={asset.src} tile={tile} />
    </div>
  );
}

function TileImage({ src, tile }: { src: string; tile: PublicResortMapTile }) {
  return (
    <Image
      src={src}
      alt=""
      width={64}
      height={64}
      className={tileImageClassName(tile)}
    />
  );
}

function tileLabel(tile: PublicResortMapTile): string {
  if (tile.type === "cabana") {
    return `${tile.id}, ${tile.availability ?? "unknown"}`;
  }

  return `${tile.type} at row ${tile.y + 1}, column ${tile.x + 1}`;
}
