import { bookingExists, type Booking } from "./bookings";
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

export type BookingErrorCode =
  | "not-cabana"
  | "already-booked"
  | "invalid-guest";

const reservedCabanaIds = new Set<string>();

export class BookingError extends Error {
  constructor(
    public readonly code: BookingErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "BookingError";
  }
}

export function getMapWithAvailability(map: ResortMap): PublicResortMap {
  return {
    width: map.width,
    height: map.height,
    tiles: map.tiles.map(tile => tileWithAvailability(tile)),
  };
}

export function bookCabana(
  map: ResortMap,
  bookings: Booking[],
  request: BookingRequest,
) {
  const tile = map.tiles.find(candidate => candidate.id === request.cabanaId);

  if (!tile || tile.type !== "cabana") {
    throw new BookingError(
      "not-cabana",
      `Cabana "${request.cabanaId}" does not exist.`,
    );
  }

  if (reservedCabanaIds.has(request.cabanaId)) {
    throw new BookingError(
      "already-booked",
      `Cabana "${request.cabanaId}" is already booked.`,
    );
  }

  if (!bookingExists(bookings, request.room, request.guestName)) {
    throw new BookingError(
      "invalid-guest",
      "Room number and guest name do not match an active booking.",
    );
  }

  reservedCabanaIds.add(request.cabanaId);

  return {
    cabanaId: request.cabanaId,
    available: false,
  };
}

export function resetReservations() {
  reservedCabanaIds.clear();
}

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
