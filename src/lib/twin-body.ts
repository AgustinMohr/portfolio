export const TWIN_MAX_BODY_BYTES = 64_000;

export type TwinJsonBodyResult =
  | { ok: true; value: unknown }
  | { ok: false; reason: "empty" | "invalid" | "too-large" };

export async function readTwinJsonBody(
  request: Request,
  maxBytes = TWIN_MAX_BODY_BYTES,
): Promise<TwinJsonBodyResult> {
  if (!request.body) return { ok: false, reason: "empty" };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      total += value.byteLength;

      if (total > maxBytes) {
        await reader.cancel().catch(() => undefined);
        return { ok: false, reason: "too-large" };
      }

      chunks.push(value);
    }
  } catch {
    return { ok: false, reason: "invalid" };
  } finally {
    reader.releaseLock();
  }

  if (total === 0) return { ok: false, reason: "empty" };

  const bytes = new Uint8Array(total);
  let offset = 0;

  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return { ok: true, value: JSON.parse(new TextDecoder().decode(bytes)) };
  } catch {
    return { ok: false, reason: "invalid" };
  }
}
