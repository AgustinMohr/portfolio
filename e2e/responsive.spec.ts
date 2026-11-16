import { expect, test } from "@playwright/test";
import { waitForHydration } from "./helpers";

const widths = [320, 390, 768, 1024, 1440, 1920];

for (const width of widths) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await waitForHydration(page);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test("header shows the nav from lg and the menu button below", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("/");
  await waitForHydration(page);
  await expect(page.getByRole("button", { name: /menú/i })).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Secciones" }),
  ).toBeHidden();

  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(
    page.getByRole("navigation", { name: "Secciones" }),
  ).toBeVisible();
});

test("interactive targets are at least 24px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/");
  await waitForHydration(page);

  const small = await page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>("a[href], button"))
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return (
          rect.width > 0 &&
          rect.height > 0 &&
          style.visibility !== "hidden" &&
          el.closest("[hidden], [inert]") === null &&
          !el.classList.contains("skip-link") &&
          (rect.width < 24 || rect.height < 24) &&
          style.display !== "inline"
        );
      })
      .map((el) => el.outerHTML.slice(0, 80)),
  );
  expect(small).toEqual([]);
});
