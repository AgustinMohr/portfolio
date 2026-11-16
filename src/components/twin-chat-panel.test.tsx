// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TwinChatPanel } from "@/components/twin-chat-panel";

describe("TwinChatPanel", () => {
  it("opens a native dialog with one isolated live region", async () => {
    const onClose = vi.fn();

    render(<TwinChatPanel open onClose={onClose} />);

    const dialog = screen.getByRole("dialog");
    expect(dialog.tagName).toBe("DIALOG");

    await waitFor(() => {
      expect((dialog as HTMLDialogElement).open).toBe(true);
    });

    const log = screen.getByRole("log");
    const status = screen.getByRole("status");

    expect(log).toHaveAttribute("aria-live", "off");
    expect(log.contains(status)).toBe(false);
    expect(screen.getByText(/OpenRouter/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cerrar chat" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
