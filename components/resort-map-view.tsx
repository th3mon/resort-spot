import { MapLegend } from "@/components/map-legend";
import { ResortMapClient } from "@/components/resort-map-client";

export function ResortMapView() {
  return (
    <section className="flex min-h-0 flex-1 flex-col gap-5">
      <header className="flex flex-col gap-3 border-b border-[#d5dfd6] bg-[#f8faf6] px-5 py-4 sm:px-8">
        <div>
          <p className="text-xs font-semibold uppercase text-[#54705d]">
            Resort Spot
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-[#172018] sm:text-3xl">
            Cabana Map
          </h1>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col gap-5 px-5 pb-6 sm:px-8 lg:flex-row">
        <ResortMapClient />
        <MapLegend />
      </main>
    </section>
  );
}
