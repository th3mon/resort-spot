import { readFile } from "node:fs/promises";
import { errorMessageFor } from "./errors";

export async function loadFile(path: string) {
  try {
    return await readFile(path, "utf8");
  } catch (error) {
    throw new Error(
      `Unable to read file at "${path}": ${errorMessageFor(error)}`,
    );
  }
}
