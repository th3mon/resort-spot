import type { PathConnections } from "@/components/map/map-grid";
import type { PublicResortMapTile } from "@/domain/reservations";
import type { ResortMapTileType } from "@/domain/resort-map";
import type { LegendTile } from "./map-legend";

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
  const baseBemClassName = `map-tile map-tile--${tile.type}`;
  const baseTileClassName = `${baseBemClassName} grid aspect-square h-10 w-10 place-items-center rounded border shadow-sm`;

  if (tile.type !== "cabana") {
    const nonCabanaTileClassName = `${baseTileClassName} ${tileSurfaceClassName(
      tile.type,
    )}`;

    return nonCabanaTileClassName;
  }

  if (tile.availability === "reserved") {
    const reservedCabanaTileClassName = `${baseTileClassName} map-tile--reserved cursor-not-allowed border-[var(--color-cabana-reserved-border)] bg-[var(--color-cabana-reserved-surface)] opacity-75 grayscale`;

    return reservedCabanaTileClassName;
  }

  const availableCabanaTileClassName = `${baseTileClassName} map-tile--available border-[var(--color-cabana-available-border)] bg-[var(--color-success-surface)] hover:border-[var(--color-action)] hover:bg-[var(--color-action-soft)] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--color-action)] ${
    isSelected ? "ring-2 ring-offset-1 ring-[var(--color-action)]" : ""
  }`;

  return availableCabanaTileClassName;
}

export function tileImageClassName(
  tile: PublicResortMapTile | LegendTile,
): string {
  const baseImageClassName = "map-tile__image object-cover";

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
    return "border-[var(--color-pool-border)] bg-[var(--color-pool-surface)]";
  }

  if (type === "path") {
    return "border-[var(--color-path-border)] bg-[var(--color-path-surface)]";
  }

  if (type === "chalet") {
    return "border-[var(--color-chalet-border)] bg-[var(--color-chalet-surface)]";
  }

  return "border-[var(--color-empty-border)] bg-[var(--color-empty-surface)]";
}
