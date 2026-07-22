import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { PublicResortMap } from "@/domain/reservations";

import { ResortMapClient } from "@/components/map";

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

  it("loads the map and lets the user select an available cabana", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(mapFixture));
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

    expect(screen.getByText("Selected: cabana-0-0")).toBeInTheDocument();
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
): Pick<Response, "json" | "ok"> => ({
  ok,
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
