import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: isCI ? 2 : 0,
  use: {
    baseURL: process.env.FRONTEND_URL || 'http://localhost:5173',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  webServer: process.env.FRONTEND_URL
    ? undefined
    : {
        command: 'pnpm dev',
        port: 5173,
        reuseExistingServer: true,
      },
  projects: [
    // Auth setup project — runs once per worker
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    // Smoke: P1 stories, Chromium only, runs on every PR
    {
      name: 'smoke-chromium',
      grep: /@smoke/,
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
    // Full suite: all stories, Chromium
    {
      name: 'full-chromium',
      grepInvert: /@smoke/,
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
    // Full suite: all stories, Firefox
    {
      name: 'full-firefox',
      grepInvert: /@smoke/,
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },
    // Full suite: all stories, WebKit
    {
      name: 'full-webkit',
      grepInvert: /@smoke/,
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
    },
  ],
});
