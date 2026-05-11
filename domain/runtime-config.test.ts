import path from "node:path";
import { describe, expect, it } from "vitest";

import { getRuntimeConfig } from "./runtime-config";

describe("getRuntimeConfig", () => {
  it("uses default data files when no CLI-derived environment is set", () => {
    expect(getRuntimeConfig({} as NodeJS.ProcessEnv)).toEqual({
      mapPath: path.resolve(process.cwd(), "data/map.ascii"),
      bookingsPath: path.resolve(process.cwd(), "data/bookings.json"),
    });
  });

  it("uses paths passed through the runtime environment", () => {
    expect(
      getRuntimeConfig({
        RESORT_SPOT_MAP_PATH: "/tmp/custom-map.ascii",
        RESORT_SPOT_BOOKINGS_PATH: "/tmp/custom-bookings.json",
      } as unknown as NodeJS.ProcessEnv),
    ).toEqual({
      mapPath: "/tmp/custom-map.ascii",
      bookingsPath: "/tmp/custom-bookings.json",
    });
  });
});
