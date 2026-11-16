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

test("streams a reply for a visitor question", async ({ page }) => {
  let sent: { messages: { role: string; content: string }[] } | undefined;

  await page.route("**/api/twin", async (route) => {
    sent = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: "text/plain; charset=utf-8",
      body: "Respuesta de prueba del gemelo.",
    });
  });

  const dialog = await openChat(page);
  await dialog
    .getByLabel("Escribí tu pregunta para el gemelo digital")
    .fill("¿Cuál es tu stack?");
  await dialog.getByRole("button", { name: "Enviar mensaje" }).click();

  await expect(
    dialog.getByRole("log").getByText("Respuesta de prueba del gemelo."),
  ).toBeVisible();
  expect(sent?.messages).toEqual([
    { role: "user", content: "¿Cuál es tu stack?" },
  ]);
});

test("shows the error, offers the email and retries", async ({ page }) => {
  let calls = 0;

  await page.route("**/api/twin", async (route) => {
    calls += 1;

    if (calls === 1) {
      await route.fulfill({
        status: 502,
        contentType: "application/json",
        body: JSON.stringify({ error: "No pude responder en este momento." }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "text/plain; charset=utf-8",
      body: "Ahora sí respondo.",
    });
  });

  const dialog = await openChat(page);
  await dialog
    .getByLabel("Escribí tu pregunta para el gemelo digital")
    .fill("Hola");
  await dialog.getByRole("button", { name: "Enviar mensaje" }).click();

  const alert = dialog.getByRole("alert");
  await expect(alert).toContainText("No pude responder en este momento.");
  await expect(
    alert.getByRole("link", { name: /Escribir a Agustín/ }),
  ).toBeVisible();

  await alert.getByRole("button", { name: "Reintentar" }).click();
  await expect(
    dialog.getByRole("log").getByText("Ahora sí respondo."),
  ).toBeVisible();
  await expect(alert).toBeHidden();
});

test("resets the conversation", async ({ page }) => {
  await page.route("**/api/twin", (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/plain; charset=utf-8",
      body: "Una respuesta.",
    }),
  );

  const dialog = await openChat(page);
  const log = dialog.getByRole("log");
  await dialog
    .getByLabel("Escribí tu pregunta para el gemelo digital")
    .fill("Hola");
  await dialog.getByRole("button", { name: "Enviar mensaje" }).click();
  await expect(log.getByText("Una respuesta.")).toBeVisible();

  await dialog.getByRole("button", { name: "Reiniciar conversación" }).click();
  await expect(log.getByText("Una respuesta.")).toBeHidden();
});
