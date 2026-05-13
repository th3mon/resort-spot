import { bookingExists, type Booking } from "./bookings";
import { BookingError } from "./errors";
import type { ResortMap, ResortMapTile } from "./resort-map";

export type PublicResortMapTile = ResortMapTile & {
  available?: boolean;
  reserved?: boolean;
};

export type PublicResortMap = {
  width: number;
  height: number;
  tiles: PublicResortMapTile[];
};

export type BookingRequest = {
  cabanaId: string;
  room: string;
  guestName: string;
};

export type CabanaReservation = {
  cabanaId: string;
  available: boolean;
};

const reservedCabanaIds = new Set<string>();

export const getMapWithAvailability = (map: ResortMap): PublicResortMap => ({
  width: map.width,
  height: map.height,
  tiles: map.tiles.map(tile => tileWithAvailability(tile)),
});

export function bookCabana(
  map: ResortMap,
  bookings: Booking[],
  { cabanaId, room, guestName }: BookingRequest,
): CabanaReservation {
  const tile: ResortMapTile | undefined = map.tiles.find(
    candidate => candidate.id === cabanaId,
  );
  const isNotBookableCabana = !tile || tile.type !== "cabana";

  if (isNotBookableCabana) {
    throw new BookingError(
      "not-cabana",
      `"${cabanaId}" is not a bookable cabana.`,
    );
  }

  if (reservedCabanaIds.has(cabanaId)) {
    throw new BookingError(
      "already-booked",
      `Cabana "${cabanaId}" is already booked.`,
    );
  }

  if (!bookingExists(bookings, room, guestName)) {
    throw new BookingError(
      "invalid-guest",
      "Room number and guest name do not match an active booking.",
    );
  }

  reservedCabanaIds.add(cabanaId);

  return {
    cabanaId,
    available: false,
  };
}

export const resetReservations = (): void => {
  reservedCabanaIds.clear();
};

function tileWithAvailability(tile: ResortMapTile): PublicResortMapTile {
  if (tile.type !== "cabana") {
    return tile;
  }

  const reserved = reservedCabanaIds.has(tile.id);

  return {
    ...tile,
    reserved,
    available: !reserved,
  };
}
