import { describe, expect, it } from "vitest";
import { readTwinJsonBody } from "@/lib/twin-body";

function requestFromChunks(chunks: Uint8Array[]) {
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(chunk);
      controller.close();
    },
  });

  return new Request("http://localhost:3100/api/twin", {
    method: "POST",
    body,
    duplex: "half",
    headers: { "content-type": "application/json" },
  } as RequestInit);
}

describe("readTwinJsonBody", () => {
  it("parses a JSON body under the limit", async () => {
    const encoder = new TextEncoder();

    const result = await readTwinJsonBody(
      requestFromChunks([encoder.encode('{"messages":[]}')]),
    );

    expect(result).toEqual({ ok: true, value: { messages: [] } });
  });

  it("rejects a chunked body over the limit", async () => {
    const encoder = new TextEncoder();

    const result = await readTwinJsonBody(
      requestFromChunks([
        encoder.encode("x".repeat(16_000)),
        encoder.encode("x".repeat(16_000)),
        encoder.encode("x".repeat(16_000)),
        encoder.encode("x".repeat(16_000)),
        encoder.encode("x".repeat(16_000)),
      ]),
    );

    expect(result).toEqual({ ok: false, reason: "too-large" });
  });

  it("rejects invalid JSON", async () => {
    const encoder = new TextEncoder();

    const result = await readTwinJsonBody(
      requestFromChunks([encoder.encode("{invalid")]),
    );

    expect(result).toEqual({ ok: false, reason: "invalid" });
  });

  it("rejects an empty body", async () => {
    const request = new Request("http://localhost:3100/api/twin", {
      method: "POST",
    });

    expect(await readTwinJsonBody(request)).toEqual({
      ok: false,
      reason: "empty",
    });
  });
});
