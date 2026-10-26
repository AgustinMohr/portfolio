import { describe, expect, it } from "vitest";
import { createTwinSseParser } from "@/lib/twin-sse";

describe("createTwinSseParser", () => {
  it("parses content and done events across chunks", () => {
    const parser = createTwinSseParser();

    expect(parser.push('data: {"choices":[{"delta":{"content":"Ho')).toEqual(
      [],
    );
    expect(
      parser.push('la"}}]}\n\ndata: [DONE]\n\n'),
    ).toEqual([
      { type: "content", content: "Hola" },
      { type: "done" },
    ]);
  });

  it("ignores comments, empty payloads and malformed JSON", () => {
    const parser = createTwinSseParser();

    expect(
      parser.push(
        ": OPENROUTER PROCESSING\n\ndata: \n\ndata: {broken}\n\n",
      ),
    ).toEqual([]);
  });

  it("surfaces provider errors", () => {
    const parser = createTwinSseParser();

    expect(
      parser.push(
        'data: {"error":{"message":"rate limited"}}\n\n',
      ),
    ).toEqual([{ type: "error", message: "rate limited" }]);
  });

  it("flushes a final data line without a trailing newline", () => {
    const parser = createTwinSseParser();

    expect(
      parser.push('data: {"choices":[{"delta":{"content":"mundo"}}]}'),
    ).toEqual([]);
    expect(parser.flush()).toEqual([
      { type: "content", content: "mundo" },
    ]);
  });
});
