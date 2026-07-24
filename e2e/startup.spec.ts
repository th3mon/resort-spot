import { expect, test } from "@playwright/test";

test("loads the resort map with default input files", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Cabana Map" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Legend" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: /cabana-\d+-\d+, available/ }).first(),
  ).toBeVisible();
  await expect(page.getByText("Available")).toBeVisible();
  await expect(page.getByText("Booked")).toBeVisible();
});
