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
