import type { PublicResortMapTile } from "@/domain/reservations";
import type { ResortMapTileType } from "@/domain/resort-map";

type TileAsset = {
  src: string;
  alt: string;
};

type Direction = "north" | "east" | "south" | "west";

export type PathTileAsset = TileAsset & {
  rotationClassName: string;
};

export type PathConnections = {
  north: boolean;
  east: boolean;
  south: boolean;
  west: boolean;
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
  const base =
    "grid aspect-square h-10 w-10 place-items-center rounded border transition";

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

  if (tile.type === "path") {
    return "h-8 w-8 object-contain sm:h-9 sm:w-9";
  }

  return "h-7 w-7 object-contain sm:h-8 sm:w-8";
}

function connectedDirectionsFor(connections: PathConnections): Direction[] {
  return (["north", "east", "south", "west"] as const).filter(
    direction => connections[direction],
  );
}

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
