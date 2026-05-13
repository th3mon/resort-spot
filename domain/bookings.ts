import { isEmpty, isNumber, isUndefined } from "lodash";
import { z } from "zod";

import { errorMessageFor } from "./errors";
import { loadFile } from "./files";

export const bookingSchema = z.object({
  room: z.union([z.string().min(1), z.number()]).transform(String),
  guestName: z.string().min(1),
});

const bookingsSchema = z.array(bookingSchema);

export type Booking = z.output<typeof bookingSchema>;

export async function loadBookings(path: string): Promise<Booking[]> {
  const source = await loadFile(path, "bookings file");

  return parseBookings(source);
}

export function parseBookings(source: string): Booking[] {
  let parsed: unknown;

  try {
    parsed = JSON.parse(source);
  } catch (error) {
    throw new Error(
      `Bookings file must contain valid JSON: ${errorMessageFor(error)}`,
    );
  }

  const result = bookingsSchema.safeParse(parsed);

  if (!result.success) {
    throw new Error(formatBookingsError(result.error));
  }

  return result.data;
}

export function bookingExists(
  bookings: Booking[],
  room: string,
  guestName: string,
): boolean {
  const normalizedRoom = normalizeField(room);
  const normalizedGuestName = normalizeField(guestName);

  return bookings.some(
    booking =>
      normalizeField(booking.room) === normalizedRoom &&
      normalizeField(booking.guestName) === normalizedGuestName,
  );
}

function formatBookingsError(error: z.ZodError): string {
  const issue = error.issues[0];

  if (!issue) {
    return "Bookings file has an invalid shape.";
  }

  if (isEmpty(issue.path)) {
    return "Bookings file must contain an array of guest records.";
  }

  const [recordIndex, field] = issue.path;

  if (!isNumber(recordIndex)) {
    return `Bookings validation failed at unexpected path "${formatZodPath(
      issue.path,
    )}". Expected a numeric booking record index.`;
  }

  if (isUndefined(field)) {
    return `Booking record ${recordIndex + 1} must be an object.`;
  }

  if (field === "room") {
    return `Booking record ${
      recordIndex + 1
    } must include a non-empty string or number room.`;
  }

  if (field === "guestName") {
    return `Booking record ${
      recordIndex + 1
    } must include a non-empty string guestName.`;
  }

  return `Booking record ${recordIndex + 1} has an invalid shape.`;
}

const formatZodPath = (path: PropertyKey[]): string =>
  path.map(String).join(".");

const normalizeField = (value: string): string => value.trim().toLowerCase();
