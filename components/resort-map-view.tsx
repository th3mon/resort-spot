"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import type {
  CabanaAvailability,
  PublicResortMap,
  PublicResortMapTile,
} from "@/domain/reservations";
import type { ResortMapTileType } from "@/domain/resort-map";

type MapState =
  | { status: "loading" }
  | { status: "ready"; map: PublicResortMap }
  | { status: "error"; message: string };

type TileAsset = {
  src: string;
  alt: string;
};

const TILE_ASSETS: Record<ResortMapTileType, TileAsset> = {
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

const LEGEND_ITEMS: Array<{
  label: string;
  type: ResortMapTileType;
  availability?: CabanaAvailability;
}> = [
  { label: "Available cabana", type: "cabana", availability: "available" },
  { label: "Booked cabana", type: "cabana", availability: "reserved" },
  { label: "Pool", type: "pool" },
  { label: "Path", type: "path" },
  { label: "Chalet", type: "chalet" },
];

export function ResortMapView() {
  const [mapState, setMapState] = useState<MapState>({ status: "loading" });
  const [selectedCabanaId, setSelectedCabanaId] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    loadMap(abortController.signal)
      .then(map => {
        setMapState({ status: "ready", map });
      })
      .catch(error => {
        if (abortController.signal.aborted) {
          return;
        }

        setMapState({
          status: "error",
          message: error instanceof Error ? error.message : String(error),
        });
      });

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-5">
      <header className="flex flex-col gap-3 border-b border-[#d5dfd6] bg-[#f8faf6] px-5 py-4 sm:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-[#54705d]">
              Resort Spot
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-[#172018] sm:text-3xl">
              Cabana Map
            </h1>
          </div>
          {selectedCabanaId ? (
            <p className="rounded border border-[#b8c9b6] bg-white px-3 py-2 text-sm font-medium text-[#28382d]">
              Selected: {selectedCabanaId}
            </p>
          ) : null}
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col gap-5 px-5 pb-6 sm:px-8 lg:flex-row">
        <div className="min-w-0 flex-1">
          {mapState.status === "loading" ? <MapLoadingState /> : null}
          {mapState.status === "error" ? (
            <MapErrorState message={mapState.message} />
          ) : null}
          {mapState.status === "ready" ? (
            <MapGrid
              map={mapState.map}
              selectedCabanaId={selectedCabanaId}
              onSelectCabana={setSelectedCabanaId}
            />
          ) : null}
        </div>

        <aside className="shrink-0 border-t border-[#d5dfd6] pt-4 lg:w-64 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <h2 className="text-sm font-semibold uppercase text-[#54705d]">
            Legend
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {LEGEND_ITEMS.map(item => (
              <li
                key={`${item.type}-${item.availability ?? "default"}`}
                className="flex items-center gap-3 text-sm text-[#28382d]"
              >
                <span
                  className={tileLegendClassName(item.type, item.availability)}
                >
                  <Image
                    src={TILE_ASSETS[item.type].src}
                    alt=""
                    width={32}
                    height={32}
                    className="h-6 w-6 object-contain"
                  />
                </span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </aside>
      </main>
    </section>
  );
}

async function loadMap(signal: AbortSignal): Promise<PublicResortMap> {
  const response = await fetch("/api/map", {
    cache: "no-store",
    signal,
  });

  const body: unknown = await response.json();

  if (!response.ok) {
    throw new Error(errorMessageFrom(body));
  }

  return body as PublicResortMap;
}

function MapGrid({
  map,
  selectedCabanaId,
  onSelectCabana,
}: {
  map: PublicResortMap;
  selectedCabanaId: string | null;
  onSelectCabana: (cabanaId: string) => void;
}) {
  return (
    <div className="overflow-auto rounded border border-[#c9d5ca] bg-[#e3eadf] p-3 shadow-sm">
      <div
        className="grid min-w-max gap-1"
        style={{
          gridTemplateColumns: `repeat(${map.width}, minmax(2.25rem, 1fr))`,
        }}
      >
        {map.tiles.map(tile => (
          <MapTile
            key={tile.id}
            tile={tile}
            isSelected={selectedCabanaId === tile.id}
            onSelectCabana={onSelectCabana}
          />
        ))}
      </div>
    </div>
  );
}

function MapTile({
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
        <Image
          src={asset.src}
          alt=""
          width={64}
          height={64}
          className={tileImageClassName(tile)}
        />
      </button>
    );
  }

  return (
    <div
      className={tileClassName(tile, false)}
      aria-label={label}
      title={label}
    >
      <Image
        src={asset.src}
        alt=""
        width={64}
        height={64}
        className={tileImageClassName(tile)}
      />
    </div>
  );
}

function MapLoadingState() {
  return (
    <div className="grid min-h-96 place-items-center rounded border border-[#c9d5ca] bg-white text-sm font-medium text-[#54705d]">
      Loading map
    </div>
  );
}

function MapErrorState({ message }: { message: string }) {
  return (
    <div className="rounded border border-[#d7aaa1] bg-[#fff7f4] p-5 text-[#6d2c21]">
      <h2 className="text-base font-semibold">Map unavailable</h2>
      <p className="mt-2 text-sm">{message}</p>
    </div>
  );
}

function tileClassName(tile: PublicResortMapTile, isSelected: boolean): string {
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

function tileImageClassName(tile: PublicResortMapTile): string {
  if (tile.type === "pool") {
    return "h-8 w-9 object-cover sm:h-9 sm:w-10";
  }

  return "h-7 w-7 object-contain sm:h-8 sm:w-8";
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

function tileLabel(tile: PublicResortMapTile): string {
  if (tile.type === "cabana") {
    return `${tile.id}, ${tile.availability ?? "unknown"}`;
  }

  return `${tile.type} at row ${tile.y + 1}, column ${tile.x + 1}`;
}

function errorMessageFrom(body: unknown): string {
  if (body && typeof body === "object" && "error" in body) {
    return String(body.error);
  }

  return "Unable to load the resort map.";
}
