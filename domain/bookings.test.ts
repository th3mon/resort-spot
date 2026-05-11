import { describe, expect, it } from "vitest";

import { guestMatchesBooking, type GuestBooking } from "./bookings";

const bookings: GuestBooking[] = [
  { room: "101", guestName: "Alice Smith" },
  { room: "204", guestName: "Xavier Green" },
];

describe("guestMatchesBooking", () => {
  it("accepts a guest when room and name match an active booking", () => {
    expect(guestMatchesBooking(bookings, "101", "Alice Smith")).toBe(true);
  });

  it("normalizes whitespace and letter case", () => {
    expect(guestMatchesBooking(bookings, " 204 ", " xavier green ")).toBe(true);
  });

  it("rejects a guest when room and name do not match the same booking", () => {
    expect(guestMatchesBooking(bookings, "101", "Xavier Green")).toBe(false);
  });
});
