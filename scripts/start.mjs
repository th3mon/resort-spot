#!/usr/bin/env node

import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_MAP_PATH = "data/map.ascii";
const DEFAULT_BOOKINGS_PATH = "data/bookings.json";

function printUsage() {
  console.error(`
Usage:
  npm run start -- [--map <path>] [--bookings <path>] [next options]
  npm run dev -- [--map <path>] [--bookings <path>] [next options]

Defaults:
  --map ${DEFAULT_MAP_PATH}
  --bookings ${DEFAULT_BOOKINGS_PATH}
`);
}

function readValue(args, index, optionName) {
  const value = args[index + 1];

  if (!value || value.startsWith("--")) {
    throw new Error(`${optionName} requires a file path.`);
  }

  return value;
}

function parseArgs(args) {
  let mapPath = DEFAULT_MAP_PATH;
  let bookingsPath = DEFAULT_BOOKINGS_PATH;
  const nextArgs = [];

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--map") {
      mapPath = readValue(args, index, "--map");
      index += 1;
      continue;
    }

    if (arg === "--bookings") {
      bookingsPath = readValue(args, index, "--bookings");
      index += 1;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      printUsage();
      process.exit(0);
    }

    nextArgs.push(arg);
  }

  return {
    mapPath,
    bookingsPath,
    nextArgs,
  };
}

function resolveFromCwd(inputPath) {
  return path.isAbsolute(inputPath)
    ? inputPath
    : path.resolve(process.cwd(), inputPath);
}

function run() {
  const scriptName = path.basename(process.env.npm_lifecycle_event ?? "start");
  const nextCommand = scriptName === "dev" ? "dev" : "start";
  const { mapPath, bookingsPath, nextArgs } = parseArgs(process.argv.slice(2));
  const currentFilePath = fileURLToPath(import.meta.url);
  const projectRoot = path.resolve(path.dirname(currentFilePath), "..");
  const nextBin = path.join(
    projectRoot,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "next.cmd" : "next",
  );

  const child = spawn(nextBin, [nextCommand, ...nextArgs], {
    cwd: projectRoot,
    env: {
      ...process.env,
      RESORT_SPOT_MAP_PATH: resolveFromCwd(mapPath),
      RESORT_SPOT_BOOKINGS_PATH: resolveFromCwd(bookingsPath),
    },
    stdio: "inherit",
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });
}

try {
  run();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  printUsage();
  process.exit(1);
}
