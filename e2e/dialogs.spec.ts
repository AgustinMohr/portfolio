import { expect, test } from "@playwright/test";
import { waitForHydration } from "./helpers";

test("mobile menu is modal and restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await waitForHydration(page);

  const toggle = page.locator('button[aria-controls="mobile-menu"]');
  await toggle.click();

  const dialog = page.getByRole("dialog", { name: "Menú de navegación" });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Cerrar menú de navegación" }),
  ).toBeVisible();

  const focusStartsInside = await page.evaluate(() => {
    const openDialog = document.querySelector("dialog[open]");
    return Boolean(
      openDialog?.contains(document.activeElement) &&
        document.activeElement,
    );
  });
  expect(focusStartsInside).toBe(true);

  const backgroundCanTakeFocus = await page.evaluate(() => {
    const link = document.querySelector<HTMLElement>(
      'header a[href="#inicio"]',
    );
    if (!link) return false;
    link.focus();
    return document.activeElement === link;
  });
  expect(backgroundCanTakeFocus).toBe(false);

  for (let index = 0; index < 10; index += 1) {
    await page.keyboard.press("Tab");
    const focusReachedBackground = await page.evaluate(() => {
      const openDialog = document.querySelector("dialog[open]");
      const active = document.activeElement;

      if (
        !openDialog ||
        !active ||
        active === document.body ||
        active === document.documentElement
      ) {
        return false;
      }

      return !openDialog.contains(active);
    });
    expect(focusReachedBackground).toBe(false);
  }

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(toggle).toBeFocused();
});

test("hides the floating launcher over the contact section", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await waitForHydration(page);

  const launcher = page.getByRole("button", { name: /Gemelo digital/ });
  const trigger = page.getByRole("button", { name: "Abrir gemelo digital" });

  await trigger.scrollIntoViewIfNeeded();
  await expect(launcher).toBeHidden();

  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Gemelo digital" });
  await expect(dialog).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("chat loads on demand and isolates the page", async ({ page }) => {
  await page.goto("/");
  await waitForHydration(page);

  const launcher = page.getByRole("button", { name: /Gemelo digital/ });
  await expect(launcher).toBeVisible();
  await launcher.click();

  const dialog = page.getByRole("dialog", { name: "Gemelo digital" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("log")).toHaveAttribute("aria-live", "off");
  await expect(dialog.getByText(/OpenRouter/)).toBeVisible();

  const focusInside = await page.evaluate(() => {
    const openDialog = document.querySelector("dialog[open]");
    return Boolean(openDialog?.contains(document.activeElement));
  });
  expect(focusInside).toBe(true);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(launcher).toBeFocused();
});
