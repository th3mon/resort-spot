import { readFile } from "node:fs/promises";

export type GuestBooking = {
  room: string;
  guestName: string;
};

export async function loadGuestBookings(bookingsPath: string) {
  let source: string;

  try {
    source = await readFile(bookingsPath, "utf8");
  } catch (error) {
    throw new Error(
      `Unable to read bookings file at "${bookingsPath}": ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  try {
    return parseGuestBookings(source);
  } catch (error) {
    throw new Error(
      `Invalid bookings file at "${bookingsPath}": ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

export function parseGuestBookings(source: string): GuestBooking[] {
  let parsed: unknown;

  try {
    parsed = JSON.parse(source);
  } catch (error) {
    throw new Error(
      `Bookings file must contain valid JSON: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Bookings file must contain an array of guest records.");
  }

  return parsed.map((booking, index) => assertGuestBooking(booking, index));
}

export function guestMatchesBooking(
  bookings: GuestBooking[],
  room: string,
  guestName: string,
) {
  const normalizedRoom = normalizeGuestField(room);
  const normalizedGuestName = normalizeGuestField(guestName);

  return bookings.some(
    booking =>
      normalizeGuestField(booking.room) === normalizedRoom &&
      normalizeGuestField(booking.guestName) === normalizedGuestName,
  );
}

function assertGuestBooking(value: unknown, index: number): GuestBooking {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Booking record ${index + 1} must be an object.`);
  }

  const candidate = value as Partial<Record<keyof GuestBooking, unknown>>;

  if (typeof candidate.room !== "string" || candidate.room.trim() === "") {
    throw new Error(
      `Booking record ${index + 1} must include a non-empty string room.`,
    );
  }

  if (
    typeof candidate.guestName !== "string" ||
    candidate.guestName.trim() === ""
  ) {
    throw new Error(
      `Booking record ${index + 1} must include a non-empty string guestName.`,
    );
  }

  return {
    room: candidate.room,
    guestName: candidate.guestName,
  };
}

function normalizeGuestField(value: string) {
  return value.trim().toLowerCase();
}
