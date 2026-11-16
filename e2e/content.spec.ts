import { expect, test } from "@playwright/test";
import { waitForHydration } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await waitForHydration(page);
});

test("projects point to their GitHub repositories and are marked in preparation", async ({ page }) => {
  const portfolio = page.locator("#portafolio");

  for (const [title, repo] of [
    ["VigaDesk", "AgustinMohr/vigadesk"],
    ["Clase Ya", "AgustinMohr/clase-ya"],
  ]) {
    const link = portfolio.getByRole("link", { name: new RegExp(title) });
    await expect(link).toHaveAttribute("href", `https://github.com/${repo}`);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noreferrer/);
    await expect(link).toContainText("En preparación");
  }
});

test("the CV asks for confirmation before downloading", async ({ page }) => {
  const trigger = page.getByRole("button", { name: /Descargar CV/ });
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: "Descargar mi CV" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("CV-AGUSTIN-MOHR.pdf");

  await dialog.getByRole("button", { name: "Cancelar" }).click();
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();

  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("accepting the dialog downloads the CV PDF", async ({ page }) => {
  await page.getByRole("button", { name: /Descargar CV/ }).click();
  const dialog = page.getByRole("dialog", { name: "Descargar mi CV" });

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    dialog.getByRole("link", { name: "Aceptar" }).click(),
  ]);

  expect(download.suggestedFilename()).toBe("CV-AGUSTIN-MOHR.pdf");
  await expect(dialog).toBeHidden();
});

test("the CV file is served as a PDF", async ({ request }) => {
  const response = await request.get("/CV-AGUSTIN-MOHR.pdf");

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
});

test("contact channels expose LinkedIn and email", async ({ page }) => {
  const linkedin = page
    .locator("#portafolio")
    .getByRole("link", { name: /Perfil profesional/ });
  await expect(linkedin).toHaveAttribute("href", /linkedin\.com\/in\//);
  await expect(linkedin).toHaveAttribute("rel", /noreferrer/);

  await expect(
    page
      .locator("#portafolio")
      .getByRole("link", { name: /Contacto directo/ }),
  ).toHaveAttribute("href", "mailto:agustinmohr@hotmail.com");
});

test("the contact form validates required fields", async ({ page }) => {
  const form = page.locator("#contacto form");

  await form.getByRole("button", { name: "Enviar mensaje" }).click();
  await expect(form.getByLabel("Nombre")).toHaveJSProperty(
    "validity.valueMissing",
    true,
  );
});
