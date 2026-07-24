import { expect, test } from "@playwright/test";

test("keeps the booking panel visible when selecting cabanas on mobile", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "cabana-6-11, available" })
    .click({ force: true });

  await expect(
    page.getByRole("heading", { name: "Book cabana-6-11" }),
  ).toBeInViewport();

  await page
    .getByRole("button", { name: "cabana-7-11, available" })
    .click({ force: true });

  await expect(
    page.getByRole("heading", { name: "Book cabana-7-11" }),
  ).toBeInViewport();
});
