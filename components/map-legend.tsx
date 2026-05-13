import Image from "next/image";

import { tileClassName, TILE_ASSETS } from "@/components/map-tile-style";
import type {
  CabanaAvailability,
  PublicResortMapTile,
} from "@/domain/reservations";
import type { ResortMapTileType } from "@/domain/resort-map";

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

export function MapLegend() {
  return (
    <aside className="shrink-0 border-t border-[#d5dfd6] pt-4 lg:w-64 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
      <h2 className="text-sm font-semibold uppercase text-[#54705d]">Legend</h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {LEGEND_ITEMS.map(item => (
          <li
            key={`${item.type}-${item.availability ?? "default"}`}
            className="flex items-center gap-3 text-sm text-[#28382d]"
          >
            <span className={tileLegendClassName(item.type, item.availability)}>
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
  );
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
