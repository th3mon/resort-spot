"use client";

import { useEffect, useState } from "react";

import { MapErrorState } from "@/components/map/map-error-state";
import { MapGrid } from "@/components/map/map-grid";
import { MapLoadingState } from "@/components/map/map-loading-state";
import type { CabanaReservation, PublicResortMap } from "@/domain/reservations";

type MapState =
  | { status: "loading" }
  | { status: "ready"; map: PublicResortMap }
  | { status: "error"; message: string };

type BookingState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string }
  | { status: "error"; message: string }
  | { status: "unavailable"; message: string };

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

  const handleSelectCabana = (cabanaId: string): void => {
    setSelectedCabanaId(cabanaId);
    setBookingState({ status: "idle" });
  };

  const handleUnavailableCabana = (cabanaId: string): void => {
    setSelectedCabanaId(null);
    setBookingState({
      status: "unavailable",
      message: `${cabanaId} is already booked. Choose another cabana.`,
    });
  };

  const handleBookingSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (!selectedCabanaId) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const room = String(formData.get("room") ?? "").trim();
    const guestName = String(formData.get("guestName") ?? "").trim();

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
          onSelectCabana={handleSelectCabana}
          onUnavailableCabana={handleUnavailableCabana}
        />
      ) : null}
    </div>
  );
}

type BookingPanelProps = {
  selectedCabanaId: string | null;
  bookingState: BookingState;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

function BookingPanel({
  selectedCabanaId,
  bookingState,
  onSubmit,
}: BookingPanelProps) {
  if (!selectedCabanaId && bookingState.status === "idle") {
    return null;
  }

  return (
    <section className="booking-panel mb-4 rounded border border-[#c9d5ca] bg-white p-4 text-sm text-[#28382d] shadow-sm">
      {selectedCabanaId ? (
        <form
          className="booking-panel__form grid gap-3 sm:max-w-xl"
          onSubmit={onSubmit}
        >
          <div className="booking-panel__header">
            <h2 className="booking-panel__title text-base font-semibold">
              Book {selectedCabanaId}
            </h2>
          </div>
          <label className="booking-panel__field grid gap-1 font-medium">
            Room number
            <input
              name="room"
              className="booking-panel__input rounded border border-[#b8c9b6] px-3 py-2 font-normal"
              autoComplete="off"
            />
          </label>
          <label className="booking-panel__field grid gap-1 font-medium">
            Guest name
            <input
              name="guestName"
              className="booking-panel__input rounded border border-[#b8c9b6] px-3 py-2 font-normal"
              autoComplete="name"
            />
          </label>
          {bookingState.status === "error" ? (
            <p
              className="booking-panel__message booking-panel__message--error text-[#6d2c21]"
              role="alert"
            >
              {bookingState.message}
            </p>
          ) : null}
          <button
            type="submit"
            className="booking-panel__action w-fit rounded border border-[#235c37] bg-[#235c37] px-4 py-2 font-semibold text-white disabled:opacity-70"
            disabled={bookingState.status === "submitting"}
          >
            {bookingState.status === "submitting"
              ? "Booking..."
              : "Book cabana"}
          </button>
        </form>
      ) : null}

      {bookingState.status === "success" ||
      bookingState.status === "unavailable" ? (
        <p
          className={
            bookingState.status === "success"
              ? "booking-panel__message booking-panel__message--success text-[#235c37]"
              : "booking-panel__message booking-panel__message--unavailable text-[#6d2c21]"
          }
          role={bookingState.status === "unavailable" ? "alert" : "status"}
        >
          {bookingState.message}
        </p>
      ) : null}
    </section>
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
