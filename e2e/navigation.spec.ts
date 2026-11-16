import { expect, test } from "@playwright/test";
import { waitForHydration } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
});

test("header links reach their section and mark it as current", async ({ page }) => {
  await page.goto("/");
  await waitForHydration(page);

  const nav = page.getByRole("navigation", { name: "Secciones" });
  const sections = [
    { name: /Trayectoria/, id: "trayectoria" },
    { name: /Portafolio/, id: "portafolio" },
    { name: /Contacto/, id: "contacto" },
  ];

  for (const { name, id } of sections) {
    await nav.getByRole("link", { name }).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(nav.getByRole("link", { name })).toHaveAttribute(
      "aria-current",
      "location",
    );
  }
});

test("skip link moves focus to the main content", async ({ page }) => {
  await page.goto("/");
  await waitForHydration(page);

  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Saltar al contenido" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#contenido$/);
});

test("privacy page is reachable from the footer", async ({ page }) => {
  await page.goto("/");
  await waitForHydration(page);

  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: /Privacidad/ })
    .click();
  await expect(page).toHaveURL(/\/privacidad$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "tus datos",
  );
});

test("unknown routes return a 404 page", async ({ page }) => {
  const response = await page.goto("/no-existe");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Fuera de sistema",
  );
  await page.getByRole("link", { name: "Volver al inicio" }).click();
  await expect(page).toHaveURL(/\/$/);
});
