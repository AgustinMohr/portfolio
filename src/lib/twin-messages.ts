import {
  TWIN_MAX_CHARS,
  TWIN_MAX_MESSAGES,
  type TwinMessage,
} from "@/lib/twin";

export function readUserMessages(value: unknown): TwinMessage[] | null {
  if (!Array.isArray(value)) return null;

  const messages: TwinMessage[] = [];

  for (const item of value) {
    if (!item || typeof item !== "object") continue;

    const role = (item as { role?: unknown }).role;
    const content = (item as { content?: unknown }).content;

    if (role !== "user" || typeof content !== "string") continue;

    const trimmed = content.trim().slice(0, TWIN_MAX_CHARS);
    if (!trimmed) continue;

    messages.push({ role: "user", content: trimmed });
  }

  if (messages.length === 0) return null;

  return messages.slice(-TWIN_MAX_MESSAGES);
}

export function buildTwinConversation(messages: TwinMessage[]): TwinMessage[] {
  const current = messages[messages.length - 1];
  if (!current || messages.length === 1) return messages;

  const previous = messages
    .slice(0, -1)
    .map((message, index) => `${index + 1}. ${message.content}`)
    .join("\n");

  return [
    {
      role: "user",
      content: `Preguntas anteriores del visitante, solo como contexto (ya fueron respondidas, no las respondas de nuevo):\n${previous}\n\nPregunta actual, la única que debés responder ahora:\n${current.content}`,
    },
  ];
}
