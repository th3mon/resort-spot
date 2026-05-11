import { describe, expect, it } from "vitest";
import { parseResortMap } from "./resort-map";

describe("parseResortMap", () => {
  it("parses known resort map symbols into typed tiles", () => {
    const map = parseResortMap("Wp#\nc..");

    expect(map).toMatchObject({
      width: 3,
      height: 2,
    });

    expect(map.tiles).toEqual([
      { id: "cabana-0-0", x: 0, y: 0, symbol: "W", type: "cabana" },
      { id: "tile-1-0", x: 1, y: 0, symbol: "p", type: "pool" },
      { id: "tile-2-0", x: 2, y: 0, symbol: "#", type: "path" },
      { id: "tile-0-1", x: 0, y: 1, symbol: "c", type: "chalet" },
      { id: "tile-1-1", x: 1, y: 1, symbol: ".", type: "empty" },
      { id: "tile-2-1", x: 2, y: 1, symbol: ".", type: "empty" },
    ]);
  });

  it("ignores one trailing newline at the end of the file", () => {
    expect(parseResortMap("..\n##\n")).toMatchObject({
      width: 2,
      height: 2,
    });
  });

  it("rejects maps that are not rectangular", () => {
    expect(() => parseResortMap("...\n..")).toThrow("Map must be rectangular");
  });

  it("rejects unsupported symbols with row and column details", () => {
    expect(() => parseResortMap(".\nX")).toThrow(
      'Map contains unsupported symbol "X" at row 2, column 1.',
    );
  });
});
