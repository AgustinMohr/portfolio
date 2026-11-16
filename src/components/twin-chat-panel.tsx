"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { profile } from "@/lib/data";
import { isNearBottom } from "@/lib/scroll";
import { streamTwinReply } from "@/lib/twin-client";
import {
  twinSuggestions,
  twinWelcome,
  type TwinRole,
} from "@/lib/twin";
import {
  CloseIcon,
  MailIcon,
  ResetIcon,
  SendIcon,
  StopIcon,
} from "./icons";

type ChatMessage = {
  id: string;
  role: TwinRole;
  content: string;
};

type TwinChatPanelProps = {
  open: boolean;
  onClose: () => void;
};

const welcomeMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: twinWelcome,
};

function createMessageId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

export function TwinChatPanel({ open, onClose }: TwinChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState("");
  const [announcement, setAnnouncement] = useState("");

  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDialogElement>(null);
  const stickToBottomRef = useRef(true);

  const lastMessage = messages[messages.length - 1];
  const canRetry =
    Boolean(error) && !isStreaming && lastMessage?.role === "user";

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    const dialog = panelRef.current;
    if (!dialog) return;

    if (!open) {
      if (dialog.open) dialog.close();
      return;
    }

    if (!dialog.open) dialog.showModal();
    stickToBottomRef.current = true;

    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    const mobile = window.matchMedia("(max-width: 639px)");
    const previousOverflow = document.body.style.overflow;
    let locked = false;

    if (mobile.matches) {
      document.body.style.overflow = "hidden";
      locked = true;
    }

    return () => {
      window.cancelAnimationFrame(frame);
      if (locked) document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const node = scrollRef.current;
    if (!node || !stickToBottomRef.current) return;

    node.scrollTo({
      top: node.scrollHeight,
      behavior: isStreaming ? "auto" : "smooth",
    });
  }, [messages, isStreaming, open]);

  function handleLogScroll() {
    const node = scrollRef.current;
    if (!node) return;

    stickToBottomRef.current = isNearBottom(node);
  }

  function closeChat() {
    abortRef.current?.abort();
    onClose();
  }

  async function runCompletion(history: ChatMessage[]) {
    setIsStreaming(true);
    setError("");
    setAnnouncement("El gemelo está pensando.");

    const controller = new AbortController();
    abortRef.current = controller;

    const assistantId = createMessageId();
    const withReply = (content: string): ChatMessage[] => [
      ...history,
      { id: assistantId, role: "assistant", content },
    ];
    let text = "";

    setMessages(withReply(""));

    try {
      const reply = await streamTwinReply(
        history
          .filter((message) => message.role === "user")
          .map(({ content }) => ({ role: "user" as const, content })),
        controller.signal,
        (partial) => {
          text = partial;
          setMessages(withReply(partial));
        },
      );

      setMessages(withReply(reply));
      setAnnouncement(reply);
    } catch (caught) {
      const partial = text.trim();
      const aborted =
        caught instanceof Error && caught.name === "AbortError";

      setMessages(partial ? withReply(partial) : history);

      if (aborted) {
        setAnnouncement(partial ? "Respuesta detenida." : "");
      } else {
        setAnnouncement("");
        setError(
          caught instanceof Error
            ? caught.message
            : "No pude responder en este momento.",
        );
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }
  function sendMessage(prompt?: string) {
    const content = (prompt ?? input).trim();
    if (!content || isStreaming) return;

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: "user",
      content,
    };
    const history = [...messages, userMessage];
    stickToBottomRef.current = true;

    setMessages(history);
    setInput("");
    setError("");
    window.requestAnimationFrame(() => inputRef.current?.focus());

    void runCompletion(history);
  }

  function retry() {
    if (isStreaming || messages[messages.length - 1]?.role !== "user") return;
    setError("");
    void runCompletion(messages);
  }

  function stop() {
    abortRef.current?.abort();
  }

  function reset() {
    if (isStreaming) return;
    stickToBottomRef.current = true;
    setMessages([welcomeMessage]);
    setError("");
    setAnnouncement("");
    setInput("");
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage();
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      sendMessage();
    }
  }

  return (
    <dialog
      ref={panelRef}
      id="twin-chat-panel"
      aria-labelledby="twin-chat-title"
      onCancel={(event) => {
        event.preventDefault();
        closeChat();
      }}
      className="twin-panel fixed inset-x-3 bottom-3 top-3 z-[80] m-0 flex max-w-none flex-col overflow-hidden border border-line-strong bg-panel p-0 shadow-2xl sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[640px] sm:max-h-[calc(100dvh-3rem)] sm:w-[400px]"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-px -top-px h-3 w-3 border-l border-t border-acid"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-px -top-px h-3 w-3 border-r border-t border-acid"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-px -left-px h-3 w-3 border-b border-l border-acid"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-px -right-px h-3 w-3 border-b border-r border-acid"
      />

      <header className="flex items-center justify-between gap-4 border-b border-line px-4 py-3.5">
        <div className="flex items-center gap-3">
          <span className="relative grid h-9 w-9 place-items-center border border-acid/40 bg-void">
            <span className="serif-accent text-[13px] leading-none text-acid">
              {profile.initials}
            </span>
            <span className="pulse-dot absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-acid" />
          </span>
          <div>
            <p
              id="twin-chat-title"
              className="text-sm font-medium tracking-tight text-bone"
            >
              Gemelo digital
            </p>
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-ash">
              IA · perfil de Agustín
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={reset}
            disabled={isStreaming}
            aria-label="Reiniciar conversación"
            className="grid h-8 w-8 place-items-center text-ash transition-colors hover:text-bone disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ResetIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={closeChat}
            aria-label="Cerrar chat"
            className="grid h-8 w-8 place-items-center text-ash transition-colors hover:text-acid"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div
        ref={scrollRef}
        role="log"
        aria-live="off"
        aria-busy={isStreaming}
        onScroll={handleLogScroll}
        className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 py-5"
      >
        {messages.map((message) => {
          const isAssistant = message.role === "assistant";
          const isCurrent =
            isStreaming && message.id === messages[messages.length - 1]?.id;

          return (
            <div
              key={message.id}
              className={
                isAssistant ? "flex items-start gap-2.5" : "flex justify-end"
              }
            >
              {isAssistant ? (
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center border border-line-strong bg-void font-mono text-xs text-acid">
                  {profile.initials}
                </span>
              ) : null}

              <div
                className={
                  isAssistant
                    ? "max-w-[85%] border border-line bg-void/60 px-3.5 py-3"
                    : "max-w-[85%] bg-acid px-3.5 py-3 text-void"
                }
              >
                {isAssistant && !message.content && isCurrent ? (
                  <span
                    aria-hidden="true"
                    className="flex items-center gap-1.5 py-1"
                  >
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-acid" />
                    <span
                      className="h-1.5 w-1.5 animate-pulse rounded-full bg-acid"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="h-1.5 w-1.5 animate-pulse rounded-full bg-acid"
                      style={{ animationDelay: "300ms" }}
                    />
                  </span>
                ) : (
                  <p className="whitespace-pre-wrap break-words text-[13px] leading-relaxed">
                    {message.content}
                    {isAssistant && isCurrent && message.content ? (
                      <span
                        aria-hidden="true"
                        className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-acid align-[-2px]"
                      />
                    ) : null}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {messages.length === 1 && !isStreaming ? (
          <div className="space-y-2 pl-[38px]">
            <p className="label text-ash">Probá preguntando</p>
            <div className="flex flex-wrap gap-2">
              {twinSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => sendMessage(suggestion)}
                  className="border border-line px-2.5 py-1.5 text-left text-xs leading-snug text-ash transition-colors hover:border-acid hover:text-acid"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {error ? (
          <div
            role="alert"
            className="ml-[38px] border border-line-strong bg-void/60 p-3"
          >
            <p className="text-xs leading-relaxed text-ash">{error}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {canRetry ? (
                <button
                  type="button"
                  onClick={retry}
                  className="font-mono text-xs uppercase tracking-[0.16em] text-acid hover:underline"
                >
                  Reintentar
                </button>
              ) : null}
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-ash transition-colors hover:text-bone"
              >
                <MailIcon className="h-3 w-3" />
                Escribir a Agustín
              </a>
            </div>
          </div>
        ) : null}
      </div>

      <span
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </span>

      <form
        onSubmit={handleSubmit}
        className="border-t border-line bg-void/40 p-3"
      >
        <div className="flex items-end gap-2 border border-line bg-void/60 p-1.5 transition-colors focus-within:border-acid/60">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            maxLength={1200}
            placeholder="Preguntame sobre mi carrera."
            aria-label="Escribí tu pregunta para el gemelo digital"
            className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2.5 py-2 text-[13px] leading-relaxed text-bone outline-none placeholder:text-ash/85"
          />
          {isStreaming ? (
            <button
              type="button"
              onClick={stop}
              aria-label="Detener respuesta"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-bone text-void transition-colors hover:bg-acid"
            >
              <StopIcon className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Enviar mensaje"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-acid text-void transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <SendIcon className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 px-1">
          <p className="text-xs leading-relaxed text-ash">
            Tus mensajes se procesan con OpenRouter y un modelo de IA de
            terceros, que puede registrarlos. No compartas información
            sensible. Puede equivocarse.{" "}
            <a
              href="/privacidad"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-bone"
            >
              Privacidad
            </a>
          </p>
          <p className="hidden font-mono text-xs uppercase tracking-[0.14em] text-ash sm:block">
            Enter envía
          </p>
        </div>
      </form>
    </dialog>
  );
}
