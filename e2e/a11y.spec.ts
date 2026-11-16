import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { waitForHydration } from "./helpers";

async function seriousViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  return results.violations
    .filter(({ impact }) => impact === "serious" || impact === "critical")
    .map(({ id, impact, nodes }) => ({
      id,
      impact,
      targets: nodes.map((node) => node.target.join(" ")),
    }));
}

test("home has no serious accessibility violations", async ({ page }) => {
  await page.goto("/");
  await waitForHydration(page);
  await page.evaluate(() => document.documentElement.classList.add("reveal-fallback"));

  expect(await seriousViolations(page)).toEqual([]);
});

test("privacy page has no serious accessibility violations", async ({ page }) => {
  await page.goto("/privacidad");

  expect(await seriousViolations(page)).toEqual([]);
});

test("open chat has no serious accessibility violations", async ({ page }) => {
  await page.goto("/");
  await waitForHydration(page);
  await page.getByRole("button", { name: /Gemelo digital/ }).click();
  await expect(page.getByRole("dialog", { name: "Gemelo digital" })).toBeVisible();

  expect(await seriousViolations(page)).toEqual([]);
});
