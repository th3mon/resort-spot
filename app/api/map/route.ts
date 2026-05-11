import { loadResortMap } from "@/domain/resort-map";
import { getRuntimeConfig } from "@/domain/runtime-config";
import { getMapWithAvailability } from "@/domain/reservations";
import { errorMessageFor } from "@/domain/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const inputs = getRuntimeConfig();

  try {
    const map = await loadResortMap(inputs.mapPath);

    return Response.json(getMapWithAvailability(map));
  } catch (error) {
    return Response.json(
      { error: errorMessageFor(error) },
      {
        status: 500,
      },
    );
  }
}
