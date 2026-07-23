import { afterEach, describe, expect, it, vi } from "vitest";

import type { PublicResortMap } from "@/domain/reservations";

import { bookSelectedCabana, loadMap } from "./resort-map-api";

describe("resort map API helpers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads the resort map with no-store cache", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(mapFixture));
    vi.stubGlobal("fetch", fetchMock);

    await expect(loadMap()).resolves.toEqual(mapFixture);

    expect(fetchMock).toHaveBeenCalledWith("/api/map", {
      cache: "no-store",
      signal: undefined,
    });
  });

  it("uses API map error messages when loading fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          jsonResponse({ error: "Unable to parse map file." }, false),
        ),
    );

    await expect(loadMap()).rejects.toThrow("Unable to parse map file.");
  });

  it("uses a fallback map error when loading fails without a response message", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({}, false)));

    await expect(loadMap()).rejects.toThrow("Unable to load the resort map.");
  });

  it("books a selected cabana", async () => {
    const reservation = {
      cabanaId: "cabana-0-0",
      availability: "reserved",
    } as const;
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ reservation }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      bookSelectedCabana("cabana-0-0", {
        room: "101",
        guestName: "Alice Smith",
      }),
    ).resolves.toEqual(reservation);

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/cabanas/cabana-0-0/book",
      expect.objectContaining({
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room: "101",
          guestName: "Alice Smith",
        }),
      }),
    );
  });

  it("encodes cabana IDs before booking", async () => {
    const reservation = {
      cabanaId: "cabana/0 0",
      availability: "reserved",
    } as const;
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ reservation }));
    vi.stubGlobal("fetch", fetchMock);

    await bookSelectedCabana("cabana/0 0", {
      room: "101",
      guestName: "Alice Smith",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/cabanas/cabana%2F0%200/book",
      expect.any(Object),
    );
  });

  it("maps malformed booking requests to a human-readable message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({}, false, 400)),
    );

    await expect(
      bookSelectedCabana("cabana-0-0", {
        room: "",
        guestName: "",
      }),
    ).rejects.toThrow("Enter a room number and guest name.");
  });

  it("uses invalid guest messages returned by the API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse(
          {
            error: "Room number and guest name do not match an active booking.",
          },
          false,
          403,
        ),
      ),
    );

    await expect(
      bookSelectedCabana("cabana-0-0", {
        room: "999",
        guestName: "Unknown Guest",
      }),
    ).rejects.toThrow(
      "Room number and guest name do not match an active booking.",
    );
  });

  it("maps unavailable cabanas to a human-readable message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({}, false, 409)),
    );

    await expect(
      bookSelectedCabana("cabana-0-0", {
        room: "101",
        guestName: "Alice Smith",
      }),
    ).rejects.toThrow("That cabana is no longer available.");
  });

  it("uses a fallback booking error for unexpected failures", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({}, false, 500)),
    );

    await expect(
      bookSelectedCabana("cabana-0-0", {
        room: "101",
        guestName: "Alice Smith",
      }),
    ).rejects.toThrow("Unable to complete booking. Please try again.");
  });

  it("rejects successful booking responses without a reservation", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({})));

    await expect(
      bookSelectedCabana("cabana-0-0", {
        room: "101",
        guestName: "Alice Smith",
      }),
    ).rejects.toThrow("Unable to complete booking. Please try again.");
  });
});

const jsonResponse = <ResponseBody>(
  body: ResponseBody,
  ok = true,
  status = ok ? 200 : 500,
): Pick<Response, "json" | "ok" | "status"> => ({
  ok,
  status,
  json: () => Promise.resolve(body),
});

const mapFixture: PublicResortMap = {
  width: 1,
  height: 1,
  tiles: [
    {
      id: "cabana-0-0",
      x: 0,
      y: 0,
      symbol: "W",
      type: "cabana",
      availability: "available",
    },
  ],
};
