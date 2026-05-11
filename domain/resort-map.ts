import { readFile } from "node:fs/promises";

export const RESORT_MAP_SYMBOLS = {
  W: "cabana",
  p: "pool",
  "#": "path",
  c: "chalet",
  ".": "empty",
} as const;

export type ResortMapSymbol = keyof typeof RESORT_MAP_SYMBOLS;
export type ResortMapTileType = (typeof RESORT_MAP_SYMBOLS)[ResortMapSymbol];

export type ResortMapTile = {
  id: string;
  x: number;
  y: number;
  symbol: ResortMapSymbol;
  type: ResortMapTileType;
};

export type ResortMap = {
  width: number;
  height: number;
  tiles: ResortMapTile[];
};

export async function loadResortMap(mapPath: string) {
  let source: string;

  try {
    source = await readFile(mapPath, "utf8");
  } catch (error) {
    throw new Error(
      `Unable to read map file at "${mapPath}": ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  try {
    return parseResortMap(source);
  } catch (error) {
    throw new Error(
      `Invalid map file at "${mapPath}": ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

export function parseResortMap(source: string): ResortMap {
  const rows = source.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const trimmedRows = rows.at(-1) === "" ? rows.slice(0, -1) : rows;

  if (trimmedRows.length === 0 || trimmedRows[0] === "") {
    throw new Error("Map file must contain at least one non-empty row.");
  }

  const width = trimmedRows[0].length;
  const tiles: ResortMapTile[] = [];

  trimmedRows.forEach((row, y) => {
    if (row.length !== width) {
      throw new Error(
        `Map must be rectangular: row 1 has width ${width}, but row ${
          y + 1
        } has width ${row.length}.`,
      );
    }

    Array.from(row).forEach((symbol, x) => {
      if (!isResortMapSymbol(symbol)) {
        throw new Error(
          `Map contains unsupported symbol "${symbol}" at row ${y + 1}, column ${
            x + 1
          }.`,
        );
      }

      const type = RESORT_MAP_SYMBOLS[symbol];

      tiles.push({
        id: tileIdFor(x, y, type),
        x,
        y,
        symbol,
        type,
      });
    });
  });

  return {
    width,
    height: trimmedRows.length,
    tiles,
  };
}

function isResortMapSymbol(value: string): value is ResortMapSymbol {
  return Object.hasOwn(RESORT_MAP_SYMBOLS, value);
}

function tileIdFor(x: number, y: number, type: ResortMapTileType) {
  return type === "cabana" ? `cabana-${x}-${y}` : `tile-${x}-${y}`;
}
