import type { Page } from "@playwright/test";

export async function waitForHydration(page: Page) {
  await page.waitForFunction(() => {
    const revealWindow = window as Window & {
      __portfolioRevealReady?: boolean;
    };

    return revealWindow.__portfolioRevealReady === true;
  });
}
