import { expect, test } from "@playwright/test";

test("renders and books from alternative input files", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Cabana Map" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "cabana-0-0, available" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "cabana-2-0, available" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "cabana-0-0, available" }).click();
  await page.getByLabel("Room number").fill("777");
  await page.getByLabel("Guest name").fill("Test Guest");
  await page.getByRole("button", { name: "Book cabana" }).click();

  await expect(page.getByText("cabana-0-0 is booked.")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "cabana-0-0, reserved" }),
  ).toHaveAttribute("aria-disabled", "true");
});
