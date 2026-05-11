import { describe, expect, it, beforeEach } from "vitest";

import type { GuestBooking } from "./bookings";
import { parseResortMap } from "./resort-map";
import {
  BookingError,
  bookCabana,
  getMapWithAvailability,
  resetReservations,
} from "./reservations";

const bookings: GuestBooking[] = [{ room: "101", guestName: "Alice Smith" }];

describe("reservations", () => {
  beforeEach(() => {
    resetReservations();
  });

  it("marks cabanas as available before booking", () => {
    const map = parseResortMap("W.");

    expect(getMapWithAvailability(map).tiles[0]).toMatchObject({
      id: "cabana-0-0",
      available: true,
      reserved: false,
    });
  });

  it("books an available cabana for a valid guest", () => {
    const map = parseResortMap("W.");

    expect(
      bookCabana(map, bookings, {
        cabanaId: "cabana-0-0",
        room: "101",
        guestName: "Alice Smith",
      }),
    ).toEqual({
      cabanaId: "cabana-0-0",
      available: false,
    });

    expect(getMapWithAvailability(map).tiles[0]).toMatchObject({
      available: false,
      reserved: true,
    });
  });

  it("rejects booking a tile that is not a cabana", () => {
    const map = parseResortMap(".W");

    expect(() =>
      bookCabana(map, bookings, {
        cabanaId: "tile-0-0",
        room: "101",
        guestName: "Alice Smith",
      }),
    ).toThrow(BookingError);
  });

  it("rejects booking an already booked cabana", () => {
    const map = parseResortMap("W.");
    const request = {
      cabanaId: "cabana-0-0",
      room: "101",
      guestName: "Alice Smith",
    };

    bookCabana(map, bookings, request);

    expect(() => bookCabana(map, bookings, request)).toThrow(
      'Cabana "cabana-0-0" is already booked.',
    );
  });

  it("rejects guests that do not match a booking", () => {
    const map = parseResortMap("W.");

    expect(() =>
      bookCabana(map, bookings, {
        cabanaId: "cabana-0-0",
        room: "999",
        guestName: "Unknown Guest",
      }),
    ).toThrow("Room number and guest name do not match an active booking.");
  });
});
