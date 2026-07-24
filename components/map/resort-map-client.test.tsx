import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { PublicResortMap } from "@/domain/reservations";

import { ResortMapClient } from "./resort-map-client";

describe("ResortMapClient", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
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

  it("validates required booking fields before sending a booking request", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(mapFixture));
    vi.stubGlobal("fetch", fetchMock);

    render(<ResortMapClient />);

    await user.click(
      await screen.findByRole("button", {
        name: "cabana-0-0, available",
      }),
    );
    await user.click(screen.getByRole("button", { name: "Book cabana" }));

    expect(await screen.findByText("Enter a room number.")).toBeInTheDocument();
    expect(screen.getByText("Enter a guest name.")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/map",
      expect.objectContaining({
        cache: "no-store",
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it("closes the booking panel when requested", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(mapFixture));
    vi.stubGlobal("fetch", fetchMock);

    render(<ResortMapClient />);

    await user.click(
      await screen.findByRole("button", {
        name: "cabana-0-0, available",
      }),
    );

    expect(
      screen.getByRole("heading", { name: "Book cabana-0-0" }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Close booking panel" }),
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: "Book cabana-0-0" }),
      ).not.toBeInTheDocument();
    });
  });

  it("scrolls to the booking panel when it opens outside the viewport", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(mapFixture));
    const scrollIntoViewMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("innerHeight", 800);
    mockBookingPanelVisibility({
      isVisible: false,
      scrollIntoViewMock,
    });

    render(<ResortMapClient />);

    await user.click(
      await screen.findByRole("button", {
        name: "cabana-0-0, available",
      }),
    );

    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });
  });

  it("does not scroll when the opened booking panel is already visible", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(mapFixture));
    const scrollIntoViewMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("innerHeight", 800);
    mockBookingPanelVisibility({
      isVisible: true,
      scrollIntoViewMock,
    });

    render(<ResortMapClient />);

    await user.click(
      await screen.findByRole("button", {
        name: "cabana-0-0, available",
      }),
    );

    expect(scrollIntoViewMock).not.toHaveBeenCalled();
  });

  it("closes the booking panel when canceled", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(mapFixture));
    vi.stubGlobal("fetch", fetchMock);

    render(<ResortMapClient />);

    await user.click(
      await screen.findByRole("button", {
        name: "cabana-0-0, available",
      }),
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: "Book cabana-0-0" }),
      ).not.toBeInTheDocument();
    });
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

  it("auto-closes the unavailable cabana message after three seconds", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(mapFixture));
    vi.stubGlobal("fetch", fetchMock);

    render(<ResortMapClient />);

    const reservedCabana = await screen.findByRole("button", {
      name: "cabana-1-1, reserved",
    });
    vi.useFakeTimers();

    act(() => {
      fireEvent.click(reservedCabana);
    });

    expect(
      screen.getByText("cabana-1-1 is already booked. Choose another cabana."),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3_000);
    });

    act(() => {
      vi.advanceTimersByTime(220);
    });

    expect(
      screen.queryByText(
        "cabana-1-1 is already booked. Choose another cabana.",
      ),
    ).not.toBeInTheDocument();
  });

  it("auto-closes the successful booking message after three seconds", async () => {
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

    await user.click(cabana);
    await user.type(screen.getByLabelText("Room number"), "101");
    await user.type(screen.getByLabelText("Guest name"), "Alice Smith");
    await user.click(screen.getByRole("button", { name: "Book cabana" }));

    await waitFor(() => {
      expect(screen.getByText("cabana-0-0 is booked.")).toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(
          screen.queryByText("cabana-0-0 is booked."),
        ).not.toBeInTheDocument();
      },
      { timeout: 3_500 },
    );
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

type MockBookingPanelVisibilityOptions = {
  isVisible: boolean;
  scrollIntoViewMock: ReturnType<typeof vi.fn>;
};

const mockBookingPanelVisibility = ({
  isVisible,
  scrollIntoViewMock,
}: MockBookingPanelVisibilityOptions) => {
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    value: scrollIntoViewMock,
  });
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function getBoundingClientRect() {
      if (this.classList.contains("booking-panel-slot__content")) {
        return rectForVisibility(isVisible);
      }

      return rectForVisibility(true);
    },
  );
};

const rectForVisibility = (isVisible: boolean): DOMRect => {
  const top = isVisible ? 20 : 900;
  const bottom = isVisible ? 200 : 1_100;

  return {
    bottom,
    height: bottom - top,
    left: 0,
    right: 200,
    top,
    width: 200,
    x: 0,
    y: top,
    toJSON: () => ({}),
  };
};
