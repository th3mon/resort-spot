"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import z from "zod";

import {
  BookingPanel,
  bookingFormSchema,
  type BookingFormErrors,
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

type MapState =
  | { status: "loading" }
  | { status: "ready"; map: PublicResortMap }
  | { status: "error"; message: string };

type RenderedBookingPanel = {
  selectedCabanaId: string | null;
  bookingState: BookingState;
};

const BOOKING_PANEL_AUTO_CLOSE_DELAY_MS = 3_000;
const BOOKING_PANEL_EXIT_ANIMATION_MS = 220;

export function ResortMapClient() {
  const [mapState, setMapState] = useState<MapState>({ status: "loading" });
  const [selectedCabanaId, setSelectedCabanaId] = useState<string | null>(null);
  const [bookingState, setBookingState] = useState<BookingState>({
    status: "idle",
  });
  const [renderedBookingPanel, setRenderedBookingPanel] =
    useState<RenderedBookingPanel | null>(null);
  const bookingPanelScrollTargetRef = useRef<HTMLDivElement>(null);
  const lastBookingPanelScrollKeyRef = useRef<string | null>(null);

  const shouldShowBookingPanel =
    selectedCabanaId !== null || bookingState.status !== "idle";
  const displayedBookingPanel = shouldShowBookingPanel
    ? { selectedCabanaId, bookingState }
    : renderedBookingPanel;
  const bookingPanelScrollKey = scrollKeyForBookingPanel(
    selectedCabanaId,
    bookingState,
  );

  const handleBookingClose = useCallback((): void => {
    setRenderedBookingPanel({ selectedCabanaId, bookingState });
    setSelectedCabanaId(null);
    setBookingState({ status: "idle" });
  }, [bookingState, selectedCabanaId]);

  const loadInitialMap = (): (() => void) => {
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
  };

  useEffect(loadInitialMap, []);

  const scheduleBookingPanelUnmount = (): (() => void) | undefined => {
    if (shouldShowBookingPanel || !renderedBookingPanel) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setRenderedBookingPanel(null);
    }, BOOKING_PANEL_EXIT_ANIMATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  };

  useEffect(scheduleBookingPanelUnmount, [
    shouldShowBookingPanel,
    renderedBookingPanel,
  ]);

  const scrollBookingPanelIntoView = (): void => {
    if (!shouldShowBookingPanel) {
      lastBookingPanelScrollKeyRef.current = null;

      return;
    }

    if (lastBookingPanelScrollKeyRef.current === bookingPanelScrollKey) {
      return;
    }

    lastBookingPanelScrollKeyRef.current = bookingPanelScrollKey;

    const scrollTarget = bookingPanelScrollTargetRef.current;

    if (!scrollTarget || isElementFullyVisible(scrollTarget)) {
      return;
    }

    scrollTarget.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(scrollBookingPanelIntoView, [
    bookingPanelScrollKey,
    shouldShowBookingPanel,
  ]);

  const scheduleBookingPanelAutoClose = (): (() => void) | undefined => {
    if (
      bookingState.status !== "success" &&
      bookingState.status !== "unavailable"
    ) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      handleBookingClose();
    }, BOOKING_PANEL_AUTO_CLOSE_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  };

  useEffect(scheduleBookingPanelAutoClose, [
    bookingState.status,
    handleBookingClose,
  ]);

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

      const errors: BookingFormErrors = {
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
      <div
        className={
          shouldShowBookingPanel
            ? "booking-panel-slot booking-panel-slot--open"
            : "booking-panel-slot"
        }
      >
        <div
          className="booking-panel-slot__content"
          ref={bookingPanelScrollTargetRef}
        >
          {displayedBookingPanel ? (
            <BookingPanel
              selectedCabanaId={displayedBookingPanel.selectedCabanaId}
              bookingState={displayedBookingPanel.bookingState}
              onClose={handleBookingClose}
              onSubmit={handleBookingSubmit}
            />
          ) : null}
        </div>
      </div>

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

const isElementFullyVisible = (element: HTMLElement): boolean => {
  const { bottom, top } = element.getBoundingClientRect();

  return top >= 0 && bottom <= window.innerHeight;
};

const scrollKeyForBookingPanel = (
  selectedCabanaId: string | null,
  bookingState: BookingState,
): string | null => {
  if (selectedCabanaId) {
    return selectedCabanaId;
  }

  if (bookingState.status !== "idle") {
    return bookingState.status;
  }

  return null;
};
