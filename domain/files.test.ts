import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { loadFile } from "./files";

describe("loadFile", () => {
  it("loads a UTF-8 text file from disk", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "file-loader-"));
    const filePath = path.join(directory, "input.txt");

    try {
      await writeFile(filePath, "hello", "utf8");

      await expect(loadFile(filePath)).resolves.toBe("hello");
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("uses a generic file description by default", async () => {
    const filePath = path.join(tmpdir(), "missing-generic-file.txt");

    await expect(loadFile(filePath)).rejects.toThrow(
      `Unable to read file at "${filePath}"`,
    );
  });

  it("uses a domain-specific file description when provided", async () => {
    const filePath = path.join(tmpdir(), "missing-map.ascii");

    await expect(loadFile(filePath, "map file")).rejects.toThrow(
      `Unable to read map file at "${filePath}"`,
    );
  });
});
