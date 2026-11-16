const DEFAULT_ERROR = "No pude responder en este momento.";
const NETWORK_ERROR = "No pude conectarme. Revisá tu conexión y probá de nuevo.";

type UserMessage = { role: "user"; content: string };

export async function streamTwinReply(
  messages: UserMessage[],
  signal: AbortSignal,
  onText: (text: string) => void,
) {
  const response = await fetch("/api/twin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
    signal,
  }).catch((caught: unknown) => {
    if (caught instanceof Error && caught.name === "AbortError") throw caught;
    throw new Error(NETWORK_ERROR);
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(data?.error ?? DEFAULT_ERROR);
  }

  if (!response.body) {
    throw new Error("No pude recibir la respuesta.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let text = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    text += decoder.decode(value, { stream: true });
    onText(text);
  }

  text = (text + decoder.decode()).trim();

  if (!text) {
    throw new Error("La respuesta vino vacía. Probá de nuevo.");
  }

  return text;
}
