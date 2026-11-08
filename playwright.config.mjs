import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

export default defineConfig({
  testDir: './tests/e2e',
  workers: 1,
  timeout: 60_000,
  use: {
    baseURL: 'http://127.0.0.1:3000',
    channel: existsSync(
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    )
      ? 'chrome'
      : undefined,
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'npm start -- --port 127.0.0.1:3000 --no-lint',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000
  }
});
