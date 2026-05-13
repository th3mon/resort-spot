import { NextResponse } from "next/server";

import { loadResortMap } from "@/domain/resort-map";
import { getRuntimeConfig } from "@/domain/runtime-config";
import { getMapWithAvailability } from "@/domain/reservations";
import { errorMessageFor } from "@/domain/errors";

export const dynamic = "force-dynamic";

export async function GET() {
  const inputs = getRuntimeConfig();

  try {
    const map = await loadResortMap(inputs.mapPath);

    return NextResponse.json(getMapWithAvailability(map));
  } catch (error) {
    return NextResponse.json(
      { error: errorMessageFor(error) },
      {
        status: 500,
      },
    );
  }
}
