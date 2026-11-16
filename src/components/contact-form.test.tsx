// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactForm } from "@/components/contact-form";

function stubLocation() {
  const location = { href: "" };
  vi.stubGlobal("location", location);
  return location;
}

afterEach(() => vi.unstubAllGlobals());

describe("ContactForm", () => {
  it("opens a mailto with the escaped subject and body", () => {
    const location = stubLocation();
    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Ana & Co" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "ana@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Mensaje/), {
      target: { value: "Hola?\nTe escribo por una pasantía." },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(location.href.startsWith("mailto:agustinmohr@hotmail.com?subject=")).toBe(true);
    const url = new URL(location.href);
    expect(url.searchParams.get("subject")).toBe(
      "Contacto desde el portfolio — Ana & Co",
    );
    expect(url.searchParams.get("body")).toContain("Te escribo por una pasantía.");
    expect(url.searchParams.get("body")).toContain("ana@example.com");
    expect(screen.getByRole("status")).toHaveTextContent("Abriendo tu cliente");
  });

  it("does nothing when a field is blank", () => {
    const location = stubLocation();
    render(<ContactForm />);

    fireEvent.submit(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(location.href).toBe("");
  });
});
