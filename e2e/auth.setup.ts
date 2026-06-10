import { chromium } from '@playwright/test';

export default async function authSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('/');
  await browser.close();
}
