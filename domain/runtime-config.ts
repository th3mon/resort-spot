import path from "node:path";

export type RuntimeConfig = {
  mapPath: string;
  bookingsPath: string;
};

export const DEFAULT_RUNTIME_CONFIG = {
  mapPath: "data/map.ascii",
  bookingsPath: "data/bookings.json",
} as const;

function resolveRuntimePath(inputPath: string) {
  return path.isAbsolute(inputPath)
    ? inputPath
    : path.resolve(/* turbopackIgnore: true */ process.cwd(), inputPath);
}

export function getRuntimeConfig(env: NodeJS.ProcessEnv = process.env) {
  return {
    mapPath: resolveRuntimePath(
      env.RESORT_SPOT_MAP_PATH ?? DEFAULT_RUNTIME_CONFIG.mapPath,
    ),
    bookingsPath: resolveRuntimePath(
      env.RESORT_SPOT_BOOKINGS_PATH ?? DEFAULT_RUNTIME_CONFIG.bookingsPath,
    ),
  } satisfies RuntimeConfig;
}
