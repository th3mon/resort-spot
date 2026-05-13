import { NextResponse } from "next/server";

import { loadBookings } from "@/domain/bookings";
import { errorMessageFor } from "@/domain/errors";
import { getRuntimeConfig } from "@/domain/runtime-config";
import { loadResortMap } from "@/domain/resort-map";

export const dynamic = "force-dynamic";

export async function GET() {
  const inputs = getRuntimeConfig();

  try {
    const [map, bookings] = await Promise.all([
      loadResortMap(inputs.mapPath),
      loadBookings(inputs.bookingsPath),
    ]);

    return NextResponse.json({
      name: "Resort Spot",
      inputs,
      status: {
        ok: true,
        map: {
          width: map.width,
          height: map.height,
          tileCount: map.tiles.length,
        },
        bookings: {
          guestCount: bookings.length,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        name: "Resort Spot",
        inputs,
        status: {
          ok: false,
          error: errorMessageFor(error),
        },
      },
      { status: 500 },
    );
  }
}
