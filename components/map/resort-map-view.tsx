import { MapLegend } from "@/components/map/map-tile";
import { ResortMapClient } from "@/components/map/resort-map-client";

export function ResortMapView() {
  return (
    <section className="resort-map-view flex min-h-0 flex-1 flex-col gap-5">
      <header className="resort-map-view__header border-b border-[#d5dfd6] bg-[#f8faf6] px-5 py-5 shadow-sm sm:px-8">
        <div className="resort-map-view__heading-group">
          <p className="resort-map-view__eyebrow text-xs font-semibold uppercase tracking-wide text-[#54705d]">
            Resort Spot
          </p>
          <h1 className="resort-map-view__title mt-1 text-2xl font-semibold text-[#172018] sm:text-3xl">
            Cabana Map
          </h1>
        </div>
      </header>

      <main className="resort-map-view__content grid min-h-0 flex-1 gap-5 px-5 pb-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <ResortMapClient />
        <MapLegend />
      </main>
    </section>
  );
}
