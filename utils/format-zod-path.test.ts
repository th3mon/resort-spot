import { describe, expect, it } from "vitest";

import { formatZodPath } from "./format-zod-path";

describe("formatZodPath", () => {
  it("joins property keys with dots", () => {
    expect(formatZodPath(["bookings", 0, "guestName"])).toBe(
      "bookings.0.guestName",
    );
  });

  it("returns an empty string for an empty path", () => {
    expect(formatZodPath([])).toBe("");
  });
});
