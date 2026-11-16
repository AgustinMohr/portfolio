import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never" }]]
    : "list",
  use: {
    baseURL: "http://localhost:3211",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 7"] },
      testMatch: /(dialogs|responsive|content|a11y)\.spec\.ts/,
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 14"] },
      testMatch: /(dialogs|responsive|content|a11y)\.spec\.ts/,
    },
  ],
  webServer: {
    command: process.env.CI
      ? "npm run start -- -p 3211"
      : "npm run dev -- -p 3211",
    url: "http://localhost:3211",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
