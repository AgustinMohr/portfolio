// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { profile } from "@/lib/data";
import { openMailto } from "@/lib/mailto";
import { CopyEmail } from "@/components/copy-email";

vi.mock("@/lib/mailto", () => ({
  openMailto: vi.fn(),
}));

const originalClipboard = Object.getOwnPropertyDescriptor(
  navigator,
  "clipboard",
);

function setClipboard(value: unknown) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value,
  });
}

afterEach(() => {
  if (originalClipboard) {
    Object.defineProperty(navigator, "clipboard", originalClipboard);
  } else {
    Reflect.deleteProperty(navigator, "clipboard");
  }
});

describe("CopyEmail", () => {
  it("shows Copiado only after a successful write", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard({ writeText });

    render(<CopyEmail />);
    fireEvent.click(
      screen.getByRole("button", { name: /copiar email/i }),
    );

    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent("Copiado");
    });

    expect(writeText).toHaveBeenCalledWith(profile.email);
    expect(openMailto).not.toHaveBeenCalled();
  });

  it("keeps the button honest and opens mailto when the write fails", async () => {
    setClipboard({
      writeText: vi.fn().mockRejectedValue(new Error("denied")),
    });

    render(<CopyEmail />);
    fireEvent.click(
      screen.getByRole("button", { name: /copiar email/i }),
    );

    await waitFor(() => {
      expect(openMailto).toHaveBeenCalledWith(profile.email);
    });

    expect(screen.getByRole("button")).toHaveTextContent("Copiar email");
    expect(screen.getByRole("status")).toHaveTextContent(
      /No se pudo copiar/,
    );
  });
});
