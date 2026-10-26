export type TwinSseEvent =
  | { type: "content"; content: string }
  | { type: "done" }
  | { type: "error"; message: string };

type Payload = {
  choices?: { delta?: { content?: string | null } }[];
  error?: { message?: string };
};

function parseLine(line: string): TwinSseEvent[] {
  const trimmed = line.trim();
  if (!trimmed.startsWith("data:")) return [];

  const data = trimmed.slice(5).trim();
  if (!data) return [];
  if (data === "[DONE]") return [{ type: "done" }];

  let parsed: Payload;

  try {
    parsed = JSON.parse(data) as Payload;
  } catch {
    return [];
  }

  if (parsed.error?.message) {
    return [{ type: "error", message: parsed.error.message }];
  }

  const content = parsed.choices?.[0]?.delta?.content;
  return content ? [{ type: "content", content }] : [];
}

export function createTwinSseParser() {
  let buffer = "";

  function drain(final: boolean) {
    const events: TwinSseEvent[] = [];
    let newline = buffer.indexOf("\n");

    while (newline !== -1) {
      const line = buffer.slice(0, newline);
      buffer = buffer.slice(newline + 1);
      events.push(...parseLine(line));
      newline = buffer.indexOf("\n");
    }

    if (final && buffer) {
      events.push(...parseLine(buffer));
      buffer = "";
    }

    return events;
  }

  return {
    push(chunk: string) {
      buffer += chunk;
      return drain(false);
    },
    flush() {
      return drain(true);
    },
  };
}
