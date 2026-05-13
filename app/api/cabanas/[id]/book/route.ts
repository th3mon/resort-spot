import { bookingSchema, loadBookings } from "@/domain/bookings";
import { errorMessageFor, statusForBookingError } from "@/domain/errors";
import { loadResortMap } from "@/domain/resort-map";
import { getRuntimeConfig } from "@/domain/runtime-config";
import { bookCabana } from "@/domain/reservations";

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
      loadBookings(inputs.bookingsPath),
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

  const result = bookingSchema.safeParse(body);

  if (!result.success) {
    throw new Error("Booking request requires room and guestName.");
  }

  return result.data;
}
