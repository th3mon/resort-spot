import Image from "next/image";

import {
  PathTileAsset,
  pathTileAssetFor,
  TILE_ASSETS,
  tileClassName,
  tileImageClassName,
} from "@/components/map";
import type {
  CabanaAvailability,
  PublicResortMapTile,
} from "@/domain/reservations";
import type { ResortMapTileType } from "@/domain/resort-map";

export type LegendTile = Pick<PublicResortMapTile, "availability" | "type"> & {
  label: string;
};

const LEGEND_TILES: LegendTile[] = [
  { label: "Available cabana", type: "cabana", availability: "available" },
  { label: "Booked cabana", type: "cabana", availability: "reserved" },
  { label: "Pool", type: "pool" },
  { label: "Path", type: "path" },
  { label: "Chalet", type: "chalet" },
  { label: "Empty", type: "empty" },
];

const LEGEND_COLOR_CLASS_NAMES = {
  container: {
    border: "border-[#d5dfd6]",
  },
  heading: {
    text: "text-[#54705d]",
  },
  item: {
    text: "text-[#28382d]",
  },
} as const;

export function MapLegend() {
  return (
    <aside
      className={`shrink-0 border-t ${LEGEND_COLOR_CLASS_NAMES.container.border} pt-4 lg:w-64 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0`}
    >
      <h2
        className={`text-sm font-semibold uppercase ${LEGEND_COLOR_CLASS_NAMES.heading.text}`}
      >
        Legend
      </h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {LEGEND_TILES.map(tile => {
          const asset = legendAssetFor(tile.type);

          return (
            <li
              key={`${tile.type}-${tile.availability ?? "default"}`}
              className={`flex items-center gap-3 text-sm ${LEGEND_COLOR_CLASS_NAMES.item.text}`}
            >
              <span
                className={tileLegendClassName(tile.type, tile.availability)}
              >
                <Image
                  src={asset.src}
                  alt=""
                  width={32}
                  height={32}
                  className={`${tileImageClassName(tile)} ${asset.rotationClassName}`}
                />
              </span>
              <span>{tile.label}</span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

function legendAssetFor(type: ResortMapTileType): PathTileAsset {
  if (type === "path") {
    return pathTileAssetFor({
      north: true,
      east: false,
      south: true,
      west: false,
    });
  }

  return {
    ...TILE_ASSETS[type],
    rotationClassName: "",
  };
}

function tileLegendClassName(
  type: ResortMapTileType,
  availability?: CabanaAvailability,
): string {
  const tile: PublicResortMapTile = {
    id: "legend",
    x: 0,
    y: 0,
    symbol: type === "cabana" ? "W" : ".",
    type,
    availability,
  };

  return tileClassName(tile, false);
}
