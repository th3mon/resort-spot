import { defineConfig, devices } from "@playwright/test";

const PORT = 3001;
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/alternative-input.spec.ts",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  webServer: {
    command: `npm run start -- --map e2e/fixtures/map.ascii --bookings e2e/fixtures/bookings.json --hostname 127.0.0.1 --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "alternative-input-chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
