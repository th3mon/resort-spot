import { describe, expect, it } from "vitest";

import { normalizeField } from "./normalize-field";

describe("normalizeField", () => {
  it("trims and lowercases field values", () => {
    expect(normalizeField("  Alice Smith  ")).toBe("alice smith");
  });
});
