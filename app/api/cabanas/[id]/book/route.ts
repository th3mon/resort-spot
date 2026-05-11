import { z } from "zod";

import { loadGuestBookings } from "@/domain/bookings";
import { errorMessageFor } from "@/domain/errors";
import { loadResortMap } from "@/domain/resort-map";
import { getRuntimeConfig } from "@/domain/runtime-config";
import { BookingError, bookCabana } from "@/domain/reservations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bookingRequestSchema = z.object({
  room: z.union([z.string().min(1), z.number()]).transform(String),
  guestName: z.string().min(1),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const inputs = getRuntimeConfig();

  try {
    const body = await parseBookingRequest(request);
    const [map, bookings] = await Promise.all([
      loadResortMap(inputs.mapPath),
      loadGuestBookings(inputs.bookingsPath),
    ]);
    const reservation = bookCabana(map, bookings, {
      cabanaId: id,
      room: body.room,
      guestName: body.guestName,
    });

    return Response.json({
      reservation,
    });
  } catch (error) {
    return Response.json(
      { error: errorMessageFor(error) },
      {
        status: statusForBookingError(error),
      },
    );
  }
}

async function parseBookingRequest(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    throw new Error("Booking request body must be valid JSON.");
  }

  const result = bookingRequestSchema.safeParse(body);

  if (!result.success) {
    throw new Error("Booking request requires room and guestName.");
  }

  return result.data;
}

function statusForBookingError(error: unknown) {
  if (!(error instanceof BookingError)) {
    return 500;
  }

  if (error.code === "already-booked") {
    return 409;
  }

  if (error.code === "invalid-guest") {
    return 403;
  }

  return 404;
}
