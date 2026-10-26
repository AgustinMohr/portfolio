import {
  readTwinJsonBody,
  TWIN_MAX_BODY_BYTES,
} from "@/lib/twin-body";
import {
  checkTwinRateLimit,
  isTwinOriginAllowed,
} from "@/lib/twin-guard";
import { readUserMessages } from "@/lib/twin-messages";
import {
  createTwinSseParser,
  type TwinSseEvent,
} from "@/lib/twin-sse";
import { TWIN_MODEL, TWIN_SYSTEM_PROMPT } from "@/lib/twin-server";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const UPSTREAM_TIMEOUT_MS = 90_000;

function errorResponse(
  message: string,
  status: number,
  headers: Record<string, string> = {},
) {
  return Response.json(
    { error: message },
    {
      status,
      headers: { "Cache-Control": "no-store", ...headers },
    },
  );
}

export async function POST(request: Request) {
  if (!isTwinOriginAllowed(request)) {
    return errorResponse("Origen no permitido.", 403);
  }

  const rate = await checkTwinRateLimit(request);
  const rateHeaders: Record<string, string> = {
    "X-RateLimit-Limit": String(rate.limit),
    "X-RateLimit-Remaining": String(rate.remaining),
    "X-RateLimit-Reset": String(Math.ceil(rate.resetAt / 1000)),
  };

  if (!rate.allowed) {
    return errorResponse(
      "Demasiadas consultas en poco tiempo. Esperá unos minutos y probá de nuevo.",
      429,
      {
        "Retry-After": String(rate.retryAfterSeconds),
        ...rateHeaders,
      },
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > TWIN_MAX_BODY_BYTES) {
    return errorResponse("La conversación es demasiado larga.", 413);
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error("OPENROUTER_API_KEY is not configured");
    return errorResponse("El gemelo digital no está configurado.", 500);
  }

  const body = await readTwinJsonBody(request);

  if (!body.ok) {
    return errorResponse(
      body.reason === "too-large"
        ? "La conversación es demasiado larga."
        : "Solicitud inválida.",
      body.reason === "too-large" ? 413 : 400,
    );
  }

  const messages = readUserMessages(
    (body.value as { messages?: unknown } | null)?.messages,
  );

  if (!messages) {
    return errorResponse("La conversación no es válida.", 400);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  const abortUpstream = () => controller.abort();
  const origin = new URL(request.url).origin;

  request.signal.addEventListener("abort", abortUpstream, { once: true });
  if (request.signal.aborted) abortUpstream();

  let upstream: Response;

  try {
    upstream = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": origin,
        "X-Title": "Portfolio - Agustin Mohr Tschopp",
      },
      body: JSON.stringify({
        model: TWIN_MODEL,
        messages: [
          { role: "system", content: TWIN_SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
        temperature: 0.5,
        max_tokens: 1000,
        top_p: 0.9,
      }),
      signal: controller.signal,
      cache: "no-store",
    });
  } catch (error) {
    clearTimeout(timeout);
    request.signal.removeEventListener("abort", abortUpstream);
    console.error("OpenRouter connection failed", error);
    return errorResponse(
      "No pude conectar con el gemelo digital. Probá de nuevo.",
      502,
    );
  }

  if (!upstream.ok || !upstream.body) {
    clearTimeout(timeout);
    request.signal.removeEventListener("abort", abortUpstream);
    const details = await upstream.text().catch(() => "");
    console.error("OpenRouter error", upstream.status, details.slice(0, 500));
    const message =
      upstream.status === 429
        ? "El gemelo está recibiendo muchas consultas. Probá en unos segundos."
        : "No pude responder en este momento. Probá de nuevo.";
    return errorResponse(message, upstream.status === 429 ? 429 : 502);
  }

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const parser = createTwinSseParser();
  let finished = false;
  let cancelled = false;

  const stream = new ReadableStream<Uint8Array>({
    async start(streamController) {
      const handleEvent = (event: TwinSseEvent) => {
        if (event.type === "done") {
          finished = true;
          return;
        }

        if (event.type === "error") {
          throw new Error(event.message);
        }

        streamController.enqueue(encoder.encode(event.content));
      };

      try {
        while (!finished) {
          const { done, value } = await reader.read();
          if (done) break;

          const events = parser.push(decoder.decode(value, { stream: true }));

          for (const event of events) {
            handleEvent(event);
            if (finished) break;
          }
        }

        if (!finished) {
          const tail = decoder.decode();

          if (tail) {
            for (const event of parser.push(tail)) {
              handleEvent(event);
              if (finished) break;
            }
          }
        }

        if (!finished) {
          for (const event of parser.flush()) {
            handleEvent(event);
            if (finished) break;
          }
        }

        if (!cancelled) streamController.close();
      } catch (error) {
        if (cancelled || (error instanceof Error && error.name === "AbortError")) {
          if (!cancelled) {
            try {
              streamController.close();
            } catch {
              void 0;
            }
          }
          return;
        }

        console.error("Twin stream failed", error);

        try {
          streamController.error(error);
        } catch {
          void 0;
        }
      } finally {
        clearTimeout(timeout);
        request.signal.removeEventListener("abort", abortUpstream);
        reader.releaseLock();
      }
    },
    cancel() {
      cancelled = true;
      clearTimeout(timeout);
      request.signal.removeEventListener("abort", abortUpstream);
      controller.abort();
      void reader.cancel().catch(() => undefined);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
      ...rateHeaders,
    },
  });
}
