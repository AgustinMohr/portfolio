import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "@/components/site-header";

describe("SiteHeader mobile menu", () => {
  it("opens a native dialog with the close control inside", async () => {
    render(<SiteHeader />);

    const toggle = screen.getByRole("button", { name: "Abrir menú" });
    fireEvent.click(toggle);

    const dialog = await screen.findByRole("dialog", {
      name: "Menú de navegación",
    });

    expect(dialog.tagName).toBe("DIALOG");
    await waitFor(() => {
      expect((dialog as HTMLDialogElement).open).toBe(true);
    });

    const close = screen.getByRole("button", {
      name: "Cerrar menú de navegación",
    });
    expect(dialog.contains(close)).toBe(true);

    fireEvent.click(close);

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Menú de navegación" }),
      ).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(document.activeElement).toBe(toggle);
    });
  });
});
