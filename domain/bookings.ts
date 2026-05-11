import { z } from "zod";

import { errorMessageFor } from "./errors";
import { loadFile } from "./files";
import { isEmpty, isNumber, isUndefined } from "lodash";

const guestBookingSchema = z.object({
  room: z.union([z.string().min(1), z.number()]).transform(String),
  guestName: z.string().min(1),
});

const guestBookingsSchema = z.array(guestBookingSchema);

export type GuestBooking = z.output<typeof guestBookingSchema>;

export async function loadGuestBookings(path: string) {
  const source = await loadFile(path, "bookings file");

  return parseGuestBookings(source);
}

export function parseGuestBookings(source: string): GuestBooking[] {
  let parsed: unknown;

  try {
    parsed = JSON.parse(source);
  } catch (error) {
    throw new Error(
      `Bookings file must contain valid JSON: ${errorMessageFor(error)}`,
    );
  }

  const result = guestBookingsSchema.safeParse(parsed);

  if (!result.success) {
    throw new Error(formatGuestBookingsError(result.error));
  }

  return result.data;
}

function formatGuestBookingsError(error: z.ZodError) {
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

function formatZodPath(path: PropertyKey[]) {
  return path.map(String).join(".");
}
