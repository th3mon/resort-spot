import { describe, expect, it } from "vitest";

import { loadBookings, parseBookings } from "./bookings";

describe("parseBookings", () => {
  it("parses guest booking records", () => {
    expect(
      parseBookings(
        JSON.stringify([{ room: "101", guestName: "Alice Smith" }]),
      ),
    ).toEqual([{ room: "101", guestName: "Alice Smith" }]);
  });

  it("normalizes numeric room values to strings", () => {
    expect(
      parseBookings(JSON.stringify([{ room: 101, guestName: "Alice Smith" }])),
    ).toEqual([{ room: "101", guestName: "Alice Smith" }]);
  });

  it("rejects JSON that is not an array", () => {
    expect(() => parseBookings("{}")).toThrow(
      "Bookings file must contain an array of guest records.",
    );
  });

  it("rejects booking records that are not objects", () => {
    expect(() => parseBookings('["not a booking record"]')).toThrow(
      "Booking record 1 must be an object.",
    );
  });

  it("rejects records with an empty guestName", () => {
    expect(() => parseBookings('[{"room":"101","guestName":""}]')).toThrow(
      "Booking record 1 must include a non-empty string guestName.",
    );
  });

  it("rejects records without a guestName", () => {
    expect(() => parseBookings('[{"room":"101"}]')).toThrow(
      "Booking record 1 must include a non-empty string guestName.",
    );
  });

  it("rejects records with an unsupported room value", () => {
    expect(() =>
      parseBookings('[{"room":false,"guestName":"Alice Smith"}]'),
    ).toThrow(
      "Booking record 1 must include a non-empty string or number room.",
    );
  });

  it("reports invalid JSON clearly", () => {
    expect(() => parseBookings("{")).toThrow(
      "Bookings file must contain valid JSON",
    );
  });
});

describe("loadBookings", () => {
  it("reports missing files as bookings file errors", async () => {
    const bookingsPath = "/tmp/missing-bookings.json";

    await expect(loadBookings(bookingsPath)).rejects.toThrow(
      `Unable to read bookings file at "${bookingsPath}"`,
    );
  });
});
