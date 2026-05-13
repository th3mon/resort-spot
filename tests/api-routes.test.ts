import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it } from "vitest";

import { POST as bookCabana } from "../app/api/cabanas/[id]/book/route";
import { GET as getMap } from "../app/api/map/route";
import { resetReservations } from "../domain/reservations";

const originalMapPath = process.env.RESORT_SPOT_MAP_PATH;
const originalBookingsPath = process.env.RESORT_SPOT_BOOKINGS_PATH;

describe("booking API routes", () => {
  afterEach(() => {
    resetReservations();
    restoreRuntimeEnv();
  });

  it("returns map data with cabana availability", async () => {
    await withInputFiles(async () => {
      const response = await getMap();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toMatchObject({
        width: 2,
        height: 2,
      });
      expect(body.tiles).toContainEqual({
        id: "cabana-0-0",
        x: 0,
        y: 0,
        symbol: "W",
        type: "cabana",
        available: true,
        reserved: false,
      });
    });
  });

  it("books a cabana and updates map availability", async () => {
    await withInputFiles(async () => {
      const bookingResponse = await postBooking("cabana-0-0", {
        room: "101",
        guestName: "Alice Smith",
      });
      const bookingBody = await bookingResponse.json();

      expect(bookingResponse.status).toBe(200);
      expect(bookingBody).toEqual({
        reservation: {
          cabanaId: "cabana-0-0",
          available: false,
        },
      });

      const mapResponse = await getMap();
      const mapBody = await mapResponse.json();

      expect(mapBody.tiles).toContainEqual({
        id: "cabana-0-0",
        x: 0,
        y: 0,
        symbol: "W",
        type: "cabana",
        available: false,
        reserved: true,
      });
    });
  });

  it("rejects invalid guests", async () => {
    await withInputFiles(async () => {
      const response = await postBooking("cabana-0-0", {
        room: "999",
        guestName: "Unknown Guest",
      });
      const body = await response.json();

      expect(response.status).toBe(403);
      expect(body).toEqual({
        error: "Room number and guest name do not match an active booking.",
      });
    });
  });

  it("rejects already booked cabanas", async () => {
    await withInputFiles(async () => {
      await postBooking("cabana-0-0", {
        room: "101",
        guestName: "Alice Smith",
      });

      const response = await postBooking("cabana-0-0", {
        room: "101",
        guestName: "Alice Smith",
      });
      const body = await response.json();

      expect(response.status).toBe(409);
      expect(body).toEqual({
        error: 'Cabana "cabana-0-0" is already booked.',
      });
    });
  });

  it("rejects tiles that are not cabanas", async () => {
    await withInputFiles(async () => {
      const response = await postBooking("tile-1-0", {
        room: "101",
        guestName: "Alice Smith",
      });
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body).toEqual({
        error: '"tile-1-0" is not a bookable cabana.',
      });
    });
  });
});

async function postBooking(
  cabanaId: string,
  body: { room: string; guestName: string },
) {
  return bookCabana(
    new NextRequest(`http://localhost/api/cabanas/${cabanaId}/book`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
    {
      params: Promise.resolve({ id: cabanaId }),
    },
  );
}

async function withInputFiles(runTest: () => Promise<void>): Promise<void> {
  const directory = await mkdtemp(path.join(tmpdir(), "resort-api-"));
  const mapPath = path.join(directory, "map.ascii");
  const bookingsPath = path.join(directory, "bookings.json");

  try {
    await writeFile(mapPath, "W.\n#c", "utf8");
    await writeFile(
      bookingsPath,
      JSON.stringify([{ room: "101", guestName: "Alice Smith" }]),
      "utf8",
    );

    process.env.RESORT_SPOT_MAP_PATH = mapPath;
    process.env.RESORT_SPOT_BOOKINGS_PATH = bookingsPath;

    await runTest();
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

function restoreRuntimeEnv(): void {
  restoreEnvValue("RESORT_SPOT_MAP_PATH", originalMapPath);
  restoreEnvValue("RESORT_SPOT_BOOKINGS_PATH", originalBookingsPath);
}

function restoreEnvValue(name: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}
