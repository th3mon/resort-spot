import type { PublicResortMapTile } from "@/domain/reservations";
import type { ResortMapTileType } from "@/domain/resort-map";

type TileAsset = {
  src: string;
  alt: string;
};

export const TILE_ASSETS: Record<ResortMapTileType, TileAsset> = {
  cabana: {
    src: "/assets/cabana.png",
    alt: "Cabana",
  },
  chalet: {
    src: "/assets/houseChimney.png",
    alt: "Chalet",
  },
  empty: {
    src: "/assets/parchmentBasic.png",
    alt: "Open resort ground",
  },
  path: {
    src: "/assets/arrowStraight.png",
    alt: "Path",
  },
  pool: {
    src: "/assets/pool.png",
    alt: "Pool",
  },
};

export function tileClassName(
  tile: PublicResortMapTile,
  isSelected: boolean,
): string {
  const base =
    "grid aspect-square h-9 w-9 place-items-center rounded border transition sm:h-10 sm:w-10";

  if (tile.type !== "cabana") {
    return `${base} ${tileSurfaceClassName(tile.type)}`;
  }

  if (tile.availability === "reserved") {
    return `${base} cursor-not-allowed border-[#9c8075] bg-[#d7c5bc] opacity-75 grayscale`;
  }

  return `${base} border-[#4d8d63] bg-[#edf8ee] hover:border-[#235c37] hover:bg-[#dff2e3] focus:outline-none focus:ring-2 focus:ring-[#235c37] ${
    isSelected ? "ring-2 ring-[#235c37]" : ""
  }`;
}

export function tileImageClassName(tile: PublicResortMapTile): string {
  if (tile.type === "pool") {
    return "h-8 w-9 object-cover sm:h-9 sm:w-10";
  }

  return "h-7 w-7 object-contain sm:h-8 sm:w-8";
}

function tileSurfaceClassName(type: ResortMapTileType): string {
  if (type === "pool") {
    return "border-[#6fa8bd] bg-[#cfeaf1]";
  }

  if (type === "path") {
    return "border-[#d5c28a] bg-[#f4e8bb]";
  }

  if (type === "chalet") {
    return "border-[#b58d6c] bg-[#f1dfcd]";
  }

  return "border-[#d8dfd3] bg-[#f7f4df]";
}
