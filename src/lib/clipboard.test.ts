import { afterEach, describe, expect, it, vi } from "vitest";
import { copyTextToClipboard } from "@/lib/clipboard";

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

describe("copyTextToClipboard", () => {
  it("returns true only after the clipboard write resolves", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard({ writeText });

    await expect(copyTextToClipboard("hola@example.com")).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith("hola@example.com");
  });

  it("returns false when the write rejects", async () => {
    setClipboard({
      writeText: vi.fn().mockRejectedValue(new Error("denied")),
    });

    await expect(copyTextToClipboard("hola@example.com")).resolves.toBe(false);
  });

  it("returns false when the Clipboard API is unavailable", async () => {
    setClipboard(undefined);

    await expect(copyTextToClipboard("hola@example.com")).resolves.toBe(false);
  });
});
