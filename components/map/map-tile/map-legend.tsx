import Image from "next/image";

import type {
  CabanaAvailability,
  PublicResortMapTile,
} from "@/domain/reservations";
import type { ResortMapTileType } from "@/domain/resort-map";
import type { PathTileAsset } from "./map-tile-style";
import {
  pathTileAssetFor,
  TILE_ASSETS,
  tileClassName,
  tileImageClassName,
} from "./map-tile-style";

export type LegendTile = Pick<PublicResortMapTile, "availability" | "type"> & {
  label: string;
};

const LEGEND_TILES: LegendTile[] = [
  { label: "Available", type: "cabana", availability: "available" },
  { label: "Booked", type: "cabana", availability: "reserved" },
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
      className={`map-legend ui-enter shrink-0 border-t ${LEGEND_COLOR_CLASS_NAMES.container.border} bg-[#eef3ed] pt-4 lg:sticky lg:top-4 lg:self-start lg:rounded lg:border lg:bg-white lg:p-4 lg:shadow-sm`}
    >
      <h2
        className={`map-legend__title text-sm font-semibold uppercase ${LEGEND_COLOR_CLASS_NAMES.heading.text}`}
      >
        Legend
      </h2>
      <ul className="map-legend__list mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {LEGEND_TILES.map(tile => {
          const asset = legendAssetFor(tile.type);

          return (
            <li
              key={`${tile.type}-${tile.availability ?? "default"}`}
              className={`map-legend__item map-legend__item--${tile.type} flex items-center gap-3 rounded px-1 py-1 text-sm ${LEGEND_COLOR_CLASS_NAMES.item.text}`}
            >
              <span
                className={`map-legend__tile ${tileLegendClassName(
                  tile.type,
                  tile.availability,
                )}`}
              >
                <Image
                  priority
                  src={asset.src}
                  alt=""
                  width={32}
                  height={32}
                  className={`${tileImageClassName(tile)} ${asset.rotationClassName}`}
                />
              </span>
              <span className="map-legend__label">{tile.label}</span>
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
