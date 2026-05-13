import { MapTile } from "@/components/map-tile";
import type { PublicResortMap } from "@/domain/reservations";

export function MapGrid({
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
