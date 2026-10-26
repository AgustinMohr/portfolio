import { expect, test } from "@playwright/test";
import { waitForHydration } from "./helpers";

test("copy email reports truthful feedback", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await waitForHydration(page);

  const copy = page.getByRole("button", {
    name: /Copiar email|Copiado/,
  });
  await copy.click();
  await expect(copy).toHaveText(/Copiado/);

  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toBe("agustinmohr@hotmail.com");
});
