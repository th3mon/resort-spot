import { expect, test } from "@playwright/test";

test("books an available cabana and refreshes its availability", async ({
  page,
}) => {
  const cabana = page.getByRole("button", {
    name: "cabana-3-11, available",
  });

  await page.goto("/");
  await cabana.click();
  await page.getByLabel("Room number").fill("101");
  await page.getByLabel("Guest name").fill("Alice Smith");
  await page.getByRole("button", { name: "Book cabana" }).click();

  await expect(page.getByText("cabana-3-11 is booked.")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "cabana-3-11, reserved" }),
  ).toHaveAttribute("aria-disabled", "true");
});

test("shows a readable error for an invalid guest", async ({ page }) => {
  const cabana = page.getByRole("button", {
    name: "cabana-4-11, available",
  });

  await page.goto("/");
  await cabana.click();
  await page.getByLabel("Room number").fill("999");
  await page.getByLabel("Guest name").fill("Unknown Guest");
  await page.getByRole("button", { name: "Book cabana" }).click();

  await expect(
    page.getByText(
      "Room number and guest name do not match an active booking.",
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "cabana-4-11, available" }),
  ).toBeVisible();
});

test("shows an unavailable message for an already booked cabana", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "cabana-5-11, available" }).click();
  await page.getByLabel("Room number").fill("102");
  await page.getByLabel("Guest name").fill("Bob Jones");
  await page.getByRole("button", { name: "Book cabana" }).click();

  const reservedCabana = page.getByRole("button", {
    name: "cabana-5-11, reserved",
  });

  await expect(reservedCabana).toBeVisible();
  await reservedCabana.click({ force: true });

  await expect(
    page.getByText("cabana-5-11 is already booked. Choose another cabana."),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Book cabana-5-11" }),
  ).toBeHidden();
});
