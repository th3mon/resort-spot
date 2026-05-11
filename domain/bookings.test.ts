import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  guestMatchesBooking,
  loadGuestBookings,
  parseGuestBookings,
  type GuestBooking,
} from "./bookings";

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

describe("parseGuestBookings", () => {
  it("parses guest booking records", () => {
    expect(
      parseGuestBookings(
        JSON.stringify([{ room: "101", guestName: "Alice Smith" }]),
      ),
    ).toEqual([{ room: "101", guestName: "Alice Smith" }]);
  });

  it("normalizes numeric room values to strings", () => {
    expect(
      parseGuestBookings(
        JSON.stringify([{ room: 101, guestName: "Alice Smith" }]),
      ),
    ).toEqual([{ room: "101", guestName: "Alice Smith" }]);
  });

  it("rejects JSON that is not an array", () => {
    expect(() => parseGuestBookings("{}")).toThrow(
      "Bookings file must contain an array of guest records.",
    );
  });

  it("rejects records without a string guestName", () => {
    expect(() => parseGuestBookings('[{"room":"101","guestName":""}]')).toThrow(
      "Booking record 1 must include a non-empty string guestName.",
    );
  });

  it("reports invalid JSON clearly", () => {
    expect(() => parseGuestBookings("{")).toThrow(
      "Bookings file must contain valid JSON",
    );
  });
});

describe("loadGuestBookings", () => {
  it("loads and validates bookings from disk", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "bookings-"));
    const bookingsPath = path.join(directory, "bookings.json");

    try {
      await writeFile(
        bookingsPath,
        JSON.stringify([{ room: "101", guestName: "Alice Smith" }]),
        "utf8",
      );

      await expect(loadGuestBookings(bookingsPath)).resolves.toEqual([
        { room: "101", guestName: "Alice Smith" },
      ]);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("reports the file path when loading fails", async () => {
    const bookingsPath = path.join(tmpdir(), "missing-bookings.json");

    await expect(loadGuestBookings(bookingsPath)).rejects.toThrow(
      `Unable to read bookings file at "${bookingsPath}"`,
    );
  });
});
