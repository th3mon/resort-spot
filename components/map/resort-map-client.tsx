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
import { bookSelectedCabana, loadMap } from "@/components/map/resort-map-api";
import type {
  PublicResortMap,
  PublicResortMapTile,
} from "@/domain/reservations";
import { BookingFormData, bookingFormSchema } from "./booking-form-schema";
import z from "zod";

type MapState =
  | { status: "loading" }
  | { status: "ready"; map: PublicResortMap }
  | { status: "error"; message: string };

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

    const validationResult = bookingFormSchema.safeParse({
      room: formData.get("room"),
      guestName: formData.get("guestName"),
    });

    if (!validationResult.success) {
      const {
        fieldErrors: {
          room: roomErrorMessages = [],
          guestName: guestNameErrorMessages = [],
        },
      } = z.flattenError(validationResult.error);

      const errors: BookingFormData = {
        room: roomErrorMessages.join(","),
        guestName: guestNameErrorMessages.join(","),
      };

      setBookingState({
        status: "error",
        errors,
      });

      return;
    }

    const { room, guestName } = validationResult.data;

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
