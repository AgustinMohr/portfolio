import { expect, test, type Page } from "@playwright/test";
import { waitForHydration } from "./helpers";

async function openChat(page: Page) {
  await page.goto("/");
  await waitForHydration(page);
  await page.getByRole("button", { name: /Gemelo digital/ }).click();

  const dialog = page.getByRole("dialog", { name: "Gemelo digital" });
  await expect(dialog).toBeVisible();
  return dialog;
}

async function ask(dialog: ReturnType<Page["getByRole"]>, text: string) {
  await dialog
    .getByLabel("Escribí tu pregunta para el gemelo digital")
    .fill(text);
  await dialog.getByRole("button", { name: "Enviar mensaje" }).click();
}

const apiErrors = [
  [400, "Tu mensaje no es válido."],
  [403, "Origen no permitido."],
  [413, "El mensaje es demasiado largo."],
  [429, "Estás preguntando muy rápido. Probá en un minuto."],
  [500, "Algo falló de mi lado."],
  [504, "La respuesta tardó demasiado."],
] as const;

for (const [status, message] of apiErrors) {
  test(`shows the server message and the email fallback on ${status}`, async ({ page }) => {
    await page.route("**/api/twin", (route) =>
      route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify({ error: message }),
      }),
    );

    const dialog = await openChat(page);
    await ask(dialog, "Hola");

    const alert = dialog.getByRole("alert");
    await expect(alert).toContainText(message);
    await expect(
      alert.getByRole("link", { name: /Escribir a Agustín/ }),
    ).toHaveAttribute("href", /^mailto:/);
  });
}

test("uses a generic message when the error body is not JSON", async ({ page }) => {
  await page.route("**/api/twin", (route) =>
    route.fulfill({ status: 500, contentType: "text/html", body: "<h1>Boom</h1>" }),
  );

  const dialog = await openChat(page);
  await ask(dialog, "Hola");

  await expect(dialog.getByRole("alert")).toContainText(
    "No pude responder en este momento.",
  );
});

test("shows a readable message when the network fails", async ({ page }) => {
  await page.route("**/api/twin", (route) => route.abort("failed"));

  const dialog = await openChat(page);
  await ask(dialog, "Hola");

  await expect(dialog.getByRole("alert")).toContainText("No pude conectarme");
});

test("reports an empty reply as an error", async ({ page }) => {
  await page.route("**/api/twin", (route) =>
    route.fulfill({ status: 200, contentType: "text/plain", body: "   " }),
  );

  const dialog = await openChat(page);
  await ask(dialog, "Hola");

  await expect(dialog.getByRole("alert")).toContainText("vino vacía");
});

test("shows the thinking state and lets the visitor stop a slow reply", async ({ page }) => {
  await page.route("**/api/twin", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 4_000));
    await route.fulfill({ status: 200, contentType: "text/plain", body: "Tarde." }).catch(() => undefined);
  });

  const dialog = await openChat(page);
  await ask(dialog, "Hola");

  const stop = dialog.getByRole("button", { name: "Detener respuesta" });
  await expect(stop).toBeVisible();
  await expect(dialog.getByRole("status")).toContainText("pensando");

  await stop.click();
  await expect(stop).toBeHidden();
  await expect(dialog.getByRole("alert")).toBeHidden();
  await expect(dialog.getByText("Tarde.")).toBeHidden();
});

test("the chat panel loads on demand after the page", async ({ page }) => {
  const chunks: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/_next/static/") && request.url().endsWith(".js")) {
      chunks.push(request.url());
    }
  });

  await page.goto("/");
  await waitForHydration(page);
  const before = chunks.length;

  await page.getByRole("button", { name: /Gemelo digital/ }).click();
  await expect(page.getByRole("dialog", { name: "Gemelo digital" })).toBeVisible();

  expect(chunks.length).toBeGreaterThan(before);
});
