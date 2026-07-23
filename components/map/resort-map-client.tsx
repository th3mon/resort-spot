"use client";

import { useEffect, useState } from "react";

import {
  BookingPanel,
  type BookingState,
  type BookingSubmitHandler,
} from "@/components/map/booking-panel";
import { MapErrorState } from "@/components/map/map-error-state";
import { MapGrid } from "@/components/map/map-grid";
import { MapLoadingState } from "@/components/map/map-loading-state";
import type {
  CabanaReservation,
  PublicResortMap,
  PublicResortMapTile,
} from "@/domain/reservations";
import { getTrimmedOrEmptyString } from "@/utils";

type MapState =
  | { status: "loading" }
  | { status: "ready"; map: PublicResortMap }
  | { status: "error"; message: string };

type BookingRequestBody = {
  room: string;
  guestName: string;
};

type BookingResponseBody =
  | { reservation: CabanaReservation }
  | { error: string };

export function ResortMapClient() {
  const [mapState, setMapState] = useState<MapState>({ status: "loading" });
  const [selectedCabanaId, setSelectedCabanaId] = useState<string | null>(null);
  const [bookingState, setBookingState] = useState<BookingState>({
    status: "idle",
  });

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

  const handleCabanaClick = (tile: PublicResortMapTile): void => {
    if (tile.availability !== "available") {
      setSelectedCabanaId(null);
      setBookingState({
        status: "unavailable",
        message: `${tile.id} is already booked. Choose another cabana.`,
      });

      return;
    }

    setSelectedCabanaId(tile.id);
    setBookingState({ status: "idle" });
  };

  const handleBookingSubmit: BookingSubmitHandler = async event => {
    event.preventDefault();

    if (!selectedCabanaId) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const room = getTrimmedOrEmptyString(formData.get("room"));
    const guestName = getTrimmedOrEmptyString(formData.get("guestName"));

    if (!room || !guestName) {
      setBookingState({
        status: "error",
        message: "Enter a room number and guest name.",
      });

      return;
    }

    setBookingState({ status: "submitting" });

    try {
      await bookSelectedCabana(selectedCabanaId, { room, guestName });
      const refreshedMap = await loadMap();

      setMapState({ status: "ready", map: refreshedMap });
      setSelectedCabanaId(null);
      setBookingState({
        status: "success",
        message: `${selectedCabanaId} is booked.`,
      });
    } catch (error) {
      setBookingState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to complete booking. Please try again.",
      });
    }
  };

  return (
    <div className="resort-map-client min-w-0 flex-1">
      <BookingPanel
        selectedCabanaId={selectedCabanaId}
        bookingState={bookingState}
        onSubmit={handleBookingSubmit}
      />

      {mapState.status === "loading" ? <MapLoadingState /> : null}
      {mapState.status === "error" ? (
        <MapErrorState message={mapState.message} />
      ) : null}
      {mapState.status === "ready" ? (
        <MapGrid
          map={mapState.map}
          selectedCabanaId={selectedCabanaId}
          onCabanaClick={handleCabanaClick}
        />
      ) : null}
    </div>
  );
}

async function loadMap(signal?: AbortSignal): Promise<PublicResortMap> {
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

async function bookSelectedCabana(
  cabanaId: string,
  body: BookingRequestBody,
): Promise<CabanaReservation> {
  const response = await fetch<BookingResponseBody>(
    `/api/cabanas/${encodeURIComponent(cabanaId)}/book`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(bookingErrorMessageFrom(response.status, responseBody));
  }

  if (!hasReservation(responseBody)) {
    throw new Error("Unable to complete booking. Please try again.");
  }

  return responseBody.reservation;
}

const errorMessageFrom = (body: unknown): string =>
  hasErrorMessage(body) ? body.error : "Unable to load the resort map.";

const hasErrorMessage = (value: unknown): value is { error: string } =>
  typeof value === "object" &&
  value !== null &&
  "error" in value &&
  typeof value.error === "string";

function bookingErrorMessageFrom(
  status: number,
  body: BookingResponseBody,
): string {
  if (status === 400) {
    return "Enter a room number and guest name.";
  }

  if (status === 403 && hasErrorMessage(body)) {
    return body.error;
  }

  if (status === 409) {
    return "That cabana is no longer available.";
  }

  return "Unable to complete booking. Please try again.";
}

const hasReservation = (
  value: BookingResponseBody,
): value is { reservation: CabanaReservation } => "reservation" in value;
