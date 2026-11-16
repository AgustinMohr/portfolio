import { afterEach, describe, expect, it, vi } from "vitest";
import { streamTwinReply } from "@/lib/twin-client";

const encoder = new TextEncoder();
const messages = [{ role: "user" as const, content: "Hola" }];

function streamOf(chunks: string[]) {
  return new Response(
    new ReadableStream<Uint8Array>({
      start(controller) {
        for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
        controller.close();
      },
    }),
    { status: 200 },
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("streamTwinReply", () => {
  it("reports partial text and returns the trimmed reply", async () => {
    const fetchMock = vi.fn().mockResolvedValue(streamOf(["  Ho", "la  "]));
    vi.stubGlobal("fetch", fetchMock);
    const seen: string[] = [];

    const reply = await streamTwinReply(
      messages,
      new AbortController().signal,
      (text) => seen.push(text),
    );

    expect(reply).toBe("Hola");
    expect(seen).toEqual(["  Ho", "  Hola  "]);
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(JSON.parse(String(init.body))).toEqual({ messages });
  });

  it("surfaces the server error message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        Response.json({ error: "Demasiadas consultas." }, { status: 429 }),
      ),
    );

    await expect(
      streamTwinReply(messages, new AbortController().signal, () => undefined),
    ).rejects.toThrow("Demasiadas consultas.");
  });

  it("falls back to a default message when the error body is not JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("boom", { status: 502 })),
    );

    await expect(
      streamTwinReply(messages, new AbortController().signal, () => undefined),
    ).rejects.toThrow("No pude responder en este momento.");
  });

  it("rejects an empty reply", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(streamOf(["  "])));

    await expect(
      streamTwinReply(messages, new AbortController().signal, () => undefined),
    ).rejects.toThrow("vino vacía");
  });

  it("replaces a raw network failure with a readable message", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));

    await expect(
      streamTwinReply(messages, new AbortController().signal, () => undefined),
    ).rejects.toThrow("No pude conectarme");
  });

  it("keeps abort errors so the UI can tell a stop from a failure", async () => {
    const abort = new DOMException("aborted", "AbortError");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(abort));

    await expect(
      streamTwinReply(messages, new AbortController().signal, () => undefined),
    ).rejects.toMatchObject({ name: "AbortError" });
  });
});
