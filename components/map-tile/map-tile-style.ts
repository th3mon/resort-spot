import type { PublicResortMapTile } from "@/domain/reservations";
import type { ResortMapTileType } from "@/domain/resort-map";
import type { PathConnections } from "../map-grid";

type TileAsset = {
  src: string;
  alt: string;
};

type Direction = "north" | "east" | "south" | "west";

export type PathTileAsset = TileAsset & {
  rotationClassName: string;
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

const TILE_COLOR_CLASS_NAMES = {
  availableCabana: {
    border: "border-[#4d8d63]",
    background: "bg-[#edf8ee]",
    hoverBorder: "hover:border-[#235c37]",
    hoverBackground: "hover:bg-[#dff2e3]",
    focusRing: "focus:ring-[#235c37]",
    selectedRing: "ring-[#235c37]",
  },
  reservedCabana: {
    border: "border-[#9c8075]",
    background: "bg-[#d7c5bc]",
  },
  surfaces: {
    pool: {
      border: "border-[#6fa8bd]",
      background: "bg-[#cfeaf1]",
    },
    path: {
      border: "border-[#d5c28a]",
      background: "bg-[#f4e8bb]",
    },
    chalet: {
      border: "border-[#b58d6c]",
      background: "bg-[#f1dfcd]",
    },
    empty: {
      border: "border-[#d8dfd3]",
      background: "bg-[#f7f4df]",
    },
  },
} as const;

export function pathTileAssetFor(connections: PathConnections): PathTileAsset {
  const connectedDirections = connectedDirectionsFor(connections);

  if (connectedDirections.length === 1) {
    return {
      src: "/assets/arrowEnd.png",
      alt: "Path end",
      rotationClassName: pathEndRotationClassName(connectedDirections[0]),
    };
  }

  if (connectedDirections.length === 2) {
    return pathAssetForTwoConnections(connections);
  }

  if (connectedDirections.length === 3) {
    return {
      src: "/assets/arrowSplit.png",
      alt: "Path split",
      rotationClassName: pathSplitRotationClassName(connections),
    };
  }

  if (connectedDirections.length === 4) {
    return {
      src: "/assets/arrowCrossing.png",
      alt: "Path crossing",
      rotationClassName: "",
    };
  }

  return {
    src: "/assets/arrowStraight.png",
    alt: "Path",
    rotationClassName: "",
  };
}

export function tileClassName(
  tile: PublicResortMapTile,
  isSelected: boolean,
): string {
  const baseTileClassName =
    "grid aspect-square h-10 w-10 place-items-center rounded border transition";

  if (tile.type !== "cabana") {
    const nonCabanaTileClassName = `${baseTileClassName} ${tileSurfaceClassName(
      tile.type,
    )}`;

    return nonCabanaTileClassName;
  }

  if (tile.availability === "reserved") {
    const reservedCabanaTileClassName = `${baseTileClassName} cursor-not-allowed ${TILE_COLOR_CLASS_NAMES.reservedCabana.border} ${TILE_COLOR_CLASS_NAMES.reservedCabana.background} opacity-75 grayscale`;

    return reservedCabanaTileClassName;
  }

  const availableCabanaTileClassName = `${baseTileClassName} ${TILE_COLOR_CLASS_NAMES.availableCabana.border} ${TILE_COLOR_CLASS_NAMES.availableCabana.background} ${TILE_COLOR_CLASS_NAMES.availableCabana.hoverBorder} ${TILE_COLOR_CLASS_NAMES.availableCabana.hoverBackground} focus:outline-none focus:ring-2 ${TILE_COLOR_CLASS_NAMES.availableCabana.focusRing} ${
    isSelected
      ? `ring-2 ${TILE_COLOR_CLASS_NAMES.availableCabana.selectedRing}`
      : ""
  }`;

  return availableCabanaTileClassName;
}

export function tileImageClassName(tile: PublicResortMapTile): string {
  const baseImageClassName = "object-cover";

  if (tile.type === "pool") {
    return `h-8 w-9 ${baseImageClassName} sm:h-9 sm:w-10`;
  }

  if (tile.type === "path") {
    return `h-8 w-8 ${baseImageClassName} sm:h-9 sm:w-9`;
  }

  return `h-7 w-7 ${baseImageClassName} sm:h-8 sm:w-8`;
}

const connectedDirectionsFor = (connections: PathConnections): Direction[] =>
  (["north", "east", "south", "west"] as const).filter(
    direction => connections[direction],
  );

function pathAssetForTwoConnections(
  connections: PathConnections,
): PathTileAsset {
  if (connections.north && connections.south) {
    return {
      src: "/assets/arrowStraight.png",
      alt: "Straight path",
      rotationClassName: "",
    };
  }

  if (connections.east && connections.west) {
    return {
      src: "/assets/arrowStraight.png",
      alt: "Straight path",
      rotationClassName: "rotate-90",
    };
  }

  return {
    src: "/assets/arrowCornerSquare.png",
    alt: "Path corner",
    rotationClassName: pathCornerRotationClassName(connections),
  };
}

function pathCornerRotationClassName(connections: PathConnections): string {
  if (connections.north && connections.east) {
    return "";
  }

  if (connections.east && connections.south) {
    return "rotate-90";
  }

  if (connections.south && connections.west) {
    return "rotate-180";
  }

  return "-rotate-90";
}

function pathEndRotationClassName(direction: Direction): string {
  if (direction === "south") {
    return "";
  }

  if (direction === "west") {
    return "rotate-90";
  }

  if (direction === "north") {
    return "rotate-180";
  }

  return "-rotate-90";
}

function pathSplitRotationClassName(connections: PathConnections): string {
  if (!connections.west) {
    return "";
  }

  if (!connections.north) {
    return "rotate-90";
  }

  if (!connections.east) {
    return "rotate-180";
  }

  return "-rotate-90";
}

function tileSurfaceClassName(type: ResortMapTileType): string {
  if (type === "pool") {
    return `${TILE_COLOR_CLASS_NAMES.surfaces.pool.border} ${TILE_COLOR_CLASS_NAMES.surfaces.pool.background}`;
  }

  if (type === "path") {
    return `${TILE_COLOR_CLASS_NAMES.surfaces.path.border} ${TILE_COLOR_CLASS_NAMES.surfaces.path.background}`;
  }

  if (type === "chalet") {
    return `${TILE_COLOR_CLASS_NAMES.surfaces.chalet.border} ${TILE_COLOR_CLASS_NAMES.surfaces.chalet.background}`;
  }

  return `${TILE_COLOR_CLASS_NAMES.surfaces.empty.border} ${TILE_COLOR_CLASS_NAMES.surfaces.empty.background}`;
}
