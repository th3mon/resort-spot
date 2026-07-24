import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  webServer: {
    command: `npm run start -- --hostname 127.0.0.1 --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      testMatch: ["**/startup.spec.ts", "**/booking-flow.spec.ts"],
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chrome",
      testMatch: ["**/startup.spec.ts", "**/mobile.spec.ts"],
      use: { ...devices["Pixel 5"] },
    },
  ],
});
