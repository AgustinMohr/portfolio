import { expect, test } from "@playwright/test";
import { waitForHydration } from "./helpers";

test("reduced motion shows all content without relying on animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await waitForHydration(page);

  const hidden = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".reveal")).filter(
      (el) => Number(getComputedStyle(el).opacity) < 1,
    ).length,
  );
  expect(hidden).toBe(0);
});
