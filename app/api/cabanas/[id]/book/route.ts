import { NextRequest, NextResponse } from "next/server";

import { bookingSchema, loadBookings, type Booking } from "@/domain/bookings";
import {
  errorMessageFor,
  RequestValidationError,
  statusForApiError,
} from "@/domain/errors";
import { loadResortMap } from "@/domain/resort-map";
import { getRuntimeConfig } from "@/domain/runtime-config";
import { bookCabana, type CabanaReservation } from "@/domain/reservations";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<
  | NextResponse<{ reservation: CabanaReservation }>
  | NextResponse<{ error: string }>
> {
  const { id } = await params;
  const inputs = getRuntimeConfig();

  try {
    const body = await parseBookingRequest(request);
    const [map, bookings] = await Promise.all([
      loadResortMap(inputs.mapPath),
      loadBookings(inputs.bookingsPath),
    ]);

    const reservation = bookCabana(map, bookings, {
      cabanaId: id,
      room: body.room,
      guestName: body.guestName,
    });

    return NextResponse.json({
      reservation,
    });
  } catch (error) {
    return NextResponse.json(
      { error: errorMessageFor(error) },
      {
        status: statusForApiError(error),
      },
    );
  }
}

async function parseBookingRequest(request: NextRequest): Promise<Booking> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    throw new RequestValidationError(
      "Booking request body must contain valid JSON.",
    );
  }

  const result = bookingSchema.safeParse(body);

  if (!result.success) {
    throw new RequestValidationError(
      "Booking request requires room and guestName.",
    );
  }

  return result.data;
}
