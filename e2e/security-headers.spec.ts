import { expect, test } from "@playwright/test";
import { waitForHydration } from "./helpers";

test("serves the security headers on the page", async ({ request }) => {
  const response = await request.get("/");
  const headers = response.headers();

  expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(headers["content-security-policy"]).toContain("default-src 'self'");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["referrer-policy"]).toBeTruthy();
  expect(headers["x-powered-by"]).toBeUndefined();
});

test("the CSP does not block anything while using the page and the chat", async ({ page }) => {
  await page.addInitScript(() => {
    (window as unknown as { __csp: string[] }).__csp = [];
    document.addEventListener("securitypolicyviolation", (event) => {
      (window as unknown as { __csp: string[] }).__csp.push(
        `${event.violatedDirective} ${event.blockedURI}`,
      );
    });
  });
  await page.route("**/api/twin", (route) =>
    route.fulfill({ status: 200, contentType: "text/plain", body: "Hola." }),
  );

  await page.goto("/");
  await waitForHydration(page);
  await page.getByRole("button", { name: /Gemelo digital/ }).click();
  const dialog = page.getByRole("dialog", { name: "Gemelo digital" });
  await dialog
    .getByLabel("Escribí tu pregunta para el gemelo digital")
    .fill("Hola");
  await dialog.getByRole("button", { name: "Enviar mensaje" }).click();
  await expect(dialog.getByRole("log").getByText("Hola.")).toBeVisible();

  const violations = await page.evaluate(
    () => (window as unknown as { __csp: string[] }).__csp,
  );
  expect(violations).toEqual([]);
});
