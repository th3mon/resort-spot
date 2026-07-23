import { describe, expect, it } from "vitest";

import type { PublicResortMapTile } from "@/domain/reservations";

import {
  pathTileAssetFor,
  tileClassName,
  tileImageClassName,
} from "./map-tile-style";

describe("map tile style helpers", () => {
  it("selects path assets from connection shape", () => {
    expect(
      pathTileAssetFor({
        north: true,
        east: false,
        south: true,
        west: false,
      }),
    ).toMatchObject({
      src: "/assets/arrowStraight.png",
      rotationClassName: "",
    });

    expect(
      pathTileAssetFor({
        north: false,
        east: true,
        south: false,
        west: true,
      }),
    ).toMatchObject({
      src: "/assets/arrowStraight.png",
      rotationClassName: "rotate-90",
    });

    expect(
      pathTileAssetFor({
        north: true,
        east: true,
        south: false,
        west: false,
      }),
    ).toMatchObject({
      src: "/assets/arrowCornerSquare.png",
      rotationClassName: "",
    });

    expect(
      pathTileAssetFor({
        north: false,
        east: true,
        south: true,
        west: false,
      }),
    ).toMatchObject({
      src: "/assets/arrowCornerSquare.png",
      rotationClassName: "rotate-90",
    });

    expect(
      pathTileAssetFor({
        north: false,
        east: false,
        south: true,
        west: true,
      }),
    ).toMatchObject({
      src: "/assets/arrowCornerSquare.png",
      rotationClassName: "rotate-180",
    });

    expect(
      pathTileAssetFor({
        north: true,
        east: false,
        south: false,
        west: true,
      }),
    ).toMatchObject({
      src: "/assets/arrowCornerSquare.png",
      rotationClassName: "-rotate-90",
    });
  });

  it("returns distinct path assets for ends, splits, crossings, and isolated paths", () => {
    expect(
      pathTileAssetFor({
        north: true,
        east: true,
        south: true,
        west: false,
      }),
    ).toMatchObject({
      src: "/assets/arrowSplit.png",
      rotationClassName: "",
    });

    expect(
      pathTileAssetFor({
        north: true,
        east: true,
        south: true,
        west: true,
      }),
    ).toMatchObject({
      src: "/assets/arrowCrossing.png",
      rotationClassName: "",
    });

    expect(
      pathTileAssetFor({
        north: false,
        east: false,
        south: false,
        west: false,
      }),
    ).toMatchObject({
      src: "/assets/arrowStraight.png",
      rotationClassName: "",
    });
  });

  it("returns distinct path assets for ends paths", () => {
    expect(
      pathTileAssetFor({
        north: true,
        east: false,
        south: false,
        west: false,
      }),
    ).toMatchObject({
      src: "/assets/arrowEnd.png",
      rotationClassName: "rotate-180",
    });

    expect(
      pathTileAssetFor({
        north: false,
        east: true,
        south: false,
        west: false,
      }),
    ).toMatchObject({
      src: "/assets/arrowEnd.png",
      rotationClassName: "-rotate-90",
    });

    expect(
      pathTileAssetFor({
        north: false,
        east: false,
        south: true,
        west: false,
      }),
    ).toMatchObject({
      src: "/assets/arrowEnd.png",
      rotationClassName: "",
    });

    expect(
      pathTileAssetFor({
        north: false,
        east: false,
        south: false,
        west: true,
      }),
    ).toMatchObject({
      src: "/assets/arrowEnd.png",
      rotationClassName: "rotate-90",
    });
  });

  it("adds cabana state classes", () => {
    expect(tileClassName(availableCabana, true)).toContain("ring-2");
    expect(tileClassName(availableCabana, true)).toContain("ring-offset-1");
    expect(tileClassName(availableCabana, true)).toContain("ring-[#235c37]");
    expect(tileClassName(reservedCabana, false)).toContain(
      "cursor-not-allowed",
    );
  });

  it("returns image sizing classes by tile type", () => {
    expect(tileImageClassName(poolTile)).toContain("object-cover");
    expect(tileImageClassName(pathTile)).toContain("h-8 w-8");
    expect(tileImageClassName(chaletTile)).toContain("h-7 w-7");
  });
});

const availableCabana: PublicResortMapTile = Object.freeze({
  id: "cabana-0-0",
  x: 0,
  y: 0,
  symbol: "W",
  type: "cabana",
  availability: "available",
} satisfies PublicResortMapTile);

const reservedCabana: PublicResortMapTile = Object.freeze({
  id: "cabana-1-0",
  x: 1,
  y: 0,
  symbol: "W",
  type: "cabana",
  availability: "reserved",
} satisfies PublicResortMapTile);

const poolTile: PublicResortMapTile = Object.freeze({
  id: "tile-0-1",
  x: 0,
  y: 1,
  symbol: "p",
  type: "pool",
} satisfies PublicResortMapTile);

const pathTile: PublicResortMapTile = Object.freeze({
  id: "tile-1-1",
  x: 1,
  y: 1,
  symbol: "#",
  type: "path",
} satisfies PublicResortMapTile);

const chaletTile: PublicResortMapTile = Object.freeze({
  id: "tile-2-1",
  x: 2,
  y: 1,
  symbol: "c",
  type: "chalet",
} satisfies PublicResortMapTile);
