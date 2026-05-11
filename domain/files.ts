import { readFile } from "node:fs/promises";

import { errorMessageFor } from "./errors";

export async function loadFile(path: string, description = "file") {
  try {
    return await readFile(path, "utf8");
  } catch (error) {
    throw new Error(
      `Unable to read ${description} at "${path}": ${errorMessageFor(error)}`,
    );
  }
}
