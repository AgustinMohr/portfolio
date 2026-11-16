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

test("the CV request opens a prefilled email", async ({ page }) => {
  const cv = page.locator("#portafolio").getByRole("link", { name: /Solicitar CV/ });
  const href = (await cv.getAttribute("href")) ?? "";

  expect(href.startsWith("mailto:agustinmohr@hotmail.com?subject=")).toBe(true);
  expect(decodeURIComponent(href)).toContain("CV — Agustín Mohr Tschopp");
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
