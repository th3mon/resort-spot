"use client";

import { useEffect, useState } from "react";

import { MapErrorState } from "@/components/map-error-state";
import { MapGrid } from "@/components/map-grid";
import { MapLoadingState } from "@/components/map-loading-state";
import type { PublicResortMap } from "@/domain/reservations";
import { unknown } from "zod/v3";

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
  const response = await fetch<PublicResortMap>("/api/map", {
    cache: "no-store",
    signal,
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(errorMessageFrom(body));
  }

  return body;
}

function errorMessageFrom(body: unknown): string {
  if (body && typeof body === "object" && "error" in body) {
    return String(body.error);
  }

  return "Unable to load the resort map.";
}

type TypedHeaders = RequestInit["headers"] & PreparedHeaders;

type PreparedHeaders = Partial<{
  "Content-Type": MimeTypes;
  Accept: MimeTypes;
  Authorization: `Bearer ${string}`;
}>;

declare function fetch<ResponseType = unknown>(
  input: RequestInfo | URL,
  init?: TypedRequestInit,
): Promise<TypedResponse<ResponseType>>;

type HttpVerbs =
  | "POST"
  | "PUT"
  | "DELETE"
  | "UPDATE"
  | "GET"
  | "CONNECT"
  | "HEAD"
  | "OPTIONS"
  | "QUERY";

type WithBody = Extract<
  HttpVerbs,
  "POST" | "PUT" | "DELETE" | "UPDATE" | "QUERY"
>;
type NonBody = Exclude<HttpVerbs, WithBody>;
type MethodBodyCombination =
  | { method?: WithBody; body?: RequestInit["body"] }
  | { method?: NonBody; body?: never };

type TypedRequestInit = RequestInit &
  MethodBodyCombination & { headers?: TypedHeaders };

interface TypedResponse<T> extends Response {
  json(): Promise<T>;
}
type MimeTypes =
  | ".jpg"
  | ".midi"
  | "XML"
  | "application/epub+zip"
  | "application/gzip"
  | "application/java-archive"
  | "application/json"
  | "application/ld+json"
  | "application/msword"
  | "application/octet-stream"
  | "application/ogg"
  | "application/pdf"
  | "application/php"
  | "application/rtf"
  | "application/vnd.amazon.ebook"
  | "application/vnd.apple.installer+xml"
  | "application/vnd.mozilla.xul+xml"
  | "application/vnd.ms-excel"
  | "application/vnd.ms-fontobject"
  | "application/vnd.ms-powerpoint"
  | "application/vnd.oasis.opendocument.presentation"
  | "application/vnd.oasis.opendocument.spreadsheet"
  | "application/vnd.oasis.opendocument.text"
  | "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "application/vnd.rar"
  | "application/vnd.visio"
  | "application/x-abiword"
  | "application/x-bzip"
  | "application/x-bzip2"
  | "application/x-csh"
  | "application/x-freearc"
  | "application/x-sh"
  | "application/x-shockwave-flash"
  | "application/x-tar"
  | "application/x-7z-compressed"
  | "application/xhtml+xml"
  | "application/zip"
  | "audio/aac"
  | "audio/mpeg"
  | "audio/ogg"
  | "audio/opus"
  | "audio/wav"
  | "audio/webm"
  | "font/otf"
  | "font/ttf"
  | "font/woff"
  | "font/woff2"
  | "image/bmp"
  | "image/gif"
  | "image/png"
  | "image/svg+xml"
  | "image/tiff"
  | "image/vnd.microsoft.icon"
  | "image/webp"
  | "text/calendar"
  | "text/css"
  | "text/csv"
  | "text/html"
  | "text/javascript"
  | "text/plain"
  | "video/3gpp"
  | "video/3gpp2"
  | "video/mp2t"
  | "video/mpeg"
  | "video/ogg"
  | "video/webm"
  | "video/x-msvideo";
