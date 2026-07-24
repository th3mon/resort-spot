# End-To-End Tests And Stabilization Plan

## Goal

Version `0.7.0` should add end-to-end coverage for the most important user flows, clean up the test scripts, verify default and alternative input files, and document the project decisions needed for submission readiness.

## Recommended Tooling

Use Playwright as the main end-to-end testing tool.

Recommended package:

```text
@playwright/test
```

Playwright is a good fit for this project because:

- it works well with Next.js applications,
- it can start the app automatically through `webServer`,
- it tests the real application in a browser,
- it supports desktop and mobile viewports,
- it provides traces, screenshots, and videos for failed tests,
- it can verify UI issues that unit and component tests cannot catch, such as mobile scrolling behavior.

## Proposed Scripts

Add dedicated E2E scripts:

```json
{
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui"
}
```

Update `check:all` so it verifies formatting instead of rewriting files:

```json
{
  "check:all": "npm run lint && npm run format:check && npm run test:ci && npm run test:e2e && npm run build"
}
```

Rationale: a check command should report problems, not mutate the working tree.

## Proposed Directory Structure

```text
e2e/
├── fixtures/
│   ├── map.ascii
│   └── bookings.json
├── booking-flow.spec.ts
├── mobile.spec.ts
└── startup.spec.ts

playwright.config.ts
```

## Key E2E Scenarios

### App starts with default input files

Verify that the app starts with the default files:

- `data/map.ascii`
- `data/bookings.json`

Expected coverage:

- the map loads,
- cabanas are visible,
- the legend is visible,
- the booking panel can be opened.

### Successful booking

Verify the full booking path:

- click an available cabana,
- fill in room number,
- fill in guest name,
- submit the form,
- see a success message,
- verify that the booked cabana becomes reserved on the refreshed map.

### Invalid guest

Verify validation against the booking data:

- click an available cabana,
- enter invalid room or guest data,
- submit the form,
- see a readable error message,
- verify that the cabana remains available.

### Unavailable cabana

Verify the unavailable path:

- click a reserved cabana,
- see a readable unavailable message,
- verify that no booking form is shown for that cabana.

### Mobile booking panel scroll

Verify the mobile UX improvement:

- use a small viewport,
- click an available cabana,
- verify that the booking panel becomes visible after automatic scrolling,
- click another available cabana while the panel is already open,
- verify that the app scrolls to the booking panel again if needed.

### Alternative input files

Verify the startup contract with custom files:

```text
npm run start -- --map e2e/fixtures/map.ascii --bookings e2e/fixtures/bookings.json
```

Expected coverage:

- the app starts with alternative files,
- the frontend renders the alternative map,
- the booking flow works with the alternative guest list.

## Playwright Configuration Approach

Use `webServer` in `playwright.config.ts` so tests can start the application automatically.

Recommended direction:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  webServer: {
    command: "npm run start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
});
```

For alternative input files, add a separate Playwright project or a separate config that starts the app with:

```text
npm run start -- --map e2e/fixtures/map.ascii --bookings e2e/fixtures/bookings.json
```

## Selector Strategy

Prefer accessible selectors:

- `getByRole`
- `getByLabel`
- `getByText`

Add `data-testid` only when accessible selectors are not stable or not expressive enough.

Good candidates for avoiding brittle selectors:

- map grid,
- map tile by cabana id,
- booking panel container.

## Stabilization Guidelines

- Avoid fixed sleeps in tests.
- Prefer Playwright assertions such as `await expect(locator).toBeVisible()`.
- Avoid testing animation internals directly.
- Keep auto-close tests focused on visible behavior.
- Use traces and screenshots for failed CI runs.
- Keep E2E fixtures small and explicit.
- Keep domain and Route Handler behavior covered by existing Vitest tests.
- Use E2E tests only for real user flows.

## README Updates

Update README with:

- how to install dependencies,
- how to start the app with default files,
- how to start the app with custom `--map` and `--bookings` files,
- how to run unit/component tests,
- how to run E2E tests,
- how to run the full check command,
- a short project structure overview,
- key trade-offs and limitations.

Important trade-offs to document:

- reservations are stored in memory,
- there is no database,
- there is no authentication,
- runtime input paths come from CLI arguments,
- the frontend renders the map only from API data.

## Suggested Implementation Order

1. Install Playwright.
2. Add `playwright.config.ts`.
3. Add the first smoke test for the app with default input files.
4. Add the successful booking flow test.
5. Add invalid guest and unavailable cabana tests.
6. Add mobile viewport test for booking panel scrolling.
7. Add alternative input fixtures and test startup with custom files.
8. Update npm scripts.
9. Update README.
10. Run `npm run check:all`.

## Acceptance Criteria Mapping

`0.7.0` acceptance criteria:

- One command runs all tests.
- Tests cover Route Handlers, domain logic, and the most important UI behavior.
- README documents running, testing, structure, and trade-offs.

Proposed implementation coverage:

- `npm run check:all` runs lint, format check, unit/component tests, E2E tests, and build.
- Existing Vitest tests cover Route Handlers and domain logic.
- Playwright tests cover the most important browser-level user flows.
- README documents setup, run commands, test commands, structure, and trade-offs.
