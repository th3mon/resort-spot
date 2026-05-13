"use client";

import { useEffect, useState } from "react";

import { MapErrorState } from "@/components/map-error-state";
import { MapGrid } from "@/components/map-grid";
import { MapLoadingState } from "@/components/map-loading-state";
import type { PublicResortMap } from "@/domain/reservations";

type MapState =
  | { status: "loading" }
  | { status: "ready"; map: PublicResortMap }
  | { status: "error"; message: string };

export function ResortMapClient() {
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
    <div className="min-w-0 flex-1">
      {selectedCabanaId ? (
        <p className="mb-3 w-fit rounded border border-[#b8c9b6] bg-white px-3 py-2 text-sm font-medium text-[#28382d]">
          Selected: {selectedCabanaId}
        </p>
      ) : null}

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

function errorMessageFrom(body: unknown): string {
  if (body && typeof body === "object" && "error" in body) {
    return String(body.error);
  }

  return "Unable to load the resort map.";
}
