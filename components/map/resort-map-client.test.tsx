import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { PublicResortMap } from "@/domain/reservations";

import { ResortMapClient } from "./resort-map-client";

describe("ResortMapClient", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("shows the loading state while the map request is pending", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {})),
    );

    render(<ResortMapClient />);

    expect(screen.getByText("Loading map")).toBeInTheDocument();
  });

  it("completes a successful booking and refreshes map availability", async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(mapFixture))
      .mockResolvedValueOnce(
        jsonResponse({
          reservation: {
            cabanaId: "cabana-0-0",
            availability: "reserved",
          },
        }),
      )
      .mockResolvedValueOnce(jsonResponse(bookedMapFixture));
    vi.stubGlobal("fetch", fetchMock);

    render(<ResortMapClient />);

    const cabana = await screen.findByRole("button", {
      name: "cabana-0-0, available",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/map",
      expect.objectContaining({
        cache: "no-store",
        signal: expect.any(AbortSignal),
      }),
    );
    expect(screen.queryByText("Loading map")).not.toBeInTheDocument();

    await user.click(cabana);
    await user.type(screen.getByLabelText("Room number"), "101");
    await user.type(screen.getByLabelText("Guest name"), "Alice Smith");
    await user.click(screen.getByRole("button", { name: "Book cabana" }));

    expect(
      await screen.findByText("cabana-0-0 is booked."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "cabana-0-0, reserved",
      }),
    ).toHaveAttribute("aria-disabled", "true");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/cabanas/cabana-0-0/book",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          room: "101",
          guestName: "Alice Smith",
        }),
      }),
    );
  });

  it("shows a readable validation message for an invalid guest", async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(mapFixture))
      .mockResolvedValueOnce(
        jsonResponse(
          {
            error: "Room number and guest name do not match an active booking.",
          },
          false,
          403,
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    render(<ResortMapClient />);

    await user.click(
      await screen.findByRole("button", {
        name: "cabana-0-0, available",
      }),
    );
    await user.type(screen.getByLabelText("Room number"), "999");
    await user.type(screen.getByLabelText("Guest name"), "Unknown Guest");
    await user.click(screen.getByRole("button", { name: "Book cabana" }));

    expect(
      await screen.findByText(
        "Room number and guest name do not match an active booking.",
      ),
    ).toBeInTheDocument();
  });

  it("shows an availability message when the user clicks an unavailable cabana", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(mapFixture));
    vi.stubGlobal("fetch", fetchMock);

    render(<ResortMapClient />);

    await user.click(
      await screen.findByRole("button", {
        name: "cabana-1-1, reserved",
      }),
    );

    expect(
      screen.getByText("cabana-1-1 is already booked. Choose another cabana."),
    ).toBeInTheDocument();
  });

  it("shows a readable API error message", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          jsonResponse({ error: "Unable to parse map file." }, false),
        ),
    );

    render(<ResortMapClient />);

    expect(await screen.findByText("Map unavailable")).toBeInTheDocument();
    expect(screen.getByText("Unable to parse map file.")).toBeInTheDocument();
  });
});

const jsonResponse = <ResponseBody,>(
  body: ResponseBody,
  ok = true,
  status = ok ? 200 : 500,
): Pick<Response, "json" | "ok" | "status"> => ({
  ok,
  status,
  json: () => Promise.resolve(body),
});

const mapFixture: PublicResortMap = {
  width: 2,
  height: 2,
  tiles: [
    {
      id: "cabana-0-0",
      x: 0,
      y: 0,
      symbol: "W",
      type: "cabana",
      availability: "available",
    },
    {
      id: "tile-1-0",
      x: 1,
      y: 0,
      symbol: "#",
      type: "path",
    },
    {
      id: "tile-0-1",
      x: 0,
      y: 1,
      symbol: "p",
      type: "pool",
    },
    {
      id: "cabana-1-1",
      x: 1,
      y: 1,
      symbol: "W",
      type: "cabana",
      availability: "reserved",
    },
  ],
};

const bookedMapFixture: PublicResortMap = {
  ...mapFixture,
  tiles: mapFixture.tiles.map(tile =>
    tile.id === "cabana-0-0"
      ? {
          ...tile,
          availability: "reserved",
        }
      : tile,
  ),
};
