import { describe, expect, it } from "vitest";

import { getTrimmedOrEmptyString } from "./get-trimmed-or-empty-string";

describe("getTrimmedOrEmptyString", () => {
  it("trims string values", () => {
    expect(getTrimmedOrEmptyString("  Alice Smith  ")).toBe("Alice Smith");
  });

  it("returns an empty string for nullish values", () => {
    expect(getTrimmedOrEmptyString(null)).toBe("");
    expect(getTrimmedOrEmptyString(undefined)).toBe("");
  });

  it("stringifies non-string values before trimming", () => {
    expect(getTrimmedOrEmptyString(101)).toBe("101");
  });
});
