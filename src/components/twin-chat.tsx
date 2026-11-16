"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { TWIN_OPEN_EVENT } from "@/lib/twin";
import { SparklesIcon } from "./icons";

const TwinChatPanel = dynamic(
  () => import("./twin-chat-panel").then((module) => module.TwinChatPanel),
  {
    ssr: false,
    loading: () => (
      <div className="fixed bottom-4 right-4 z-30 rounded-full border border-line-strong bg-void/90 px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-ash sm:bottom-6 sm:right-6">
        Cargando…
      </div>
    ),
  },
);

export function TwinChat() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleOpen = () => {
      const active = document.activeElement;
      triggerRef.current =
        active instanceof HTMLElement && active.matches("[data-twin-trigger]")
          ? active
          : document.querySelector<HTMLElement>("[data-twin-trigger]");
      setLoaded(true);
      setOpen(true);
    };

    window.addEventListener(TWIN_OPEN_EVENT, handleOpen);
    return () => window.removeEventListener(TWIN_OPEN_EVENT, handleOpen);
  }, []);

  useEffect(() => {
    const contact = document.getElementById("contacto");
    if (!contact || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => setContactVisible(entry.isIntersecting),
      { threshold: 0 },
    );

    observer.observe(contact);
    return () => observer.disconnect();
  }, []);

  function openChat() {
    triggerRef.current = launcherRef.current;
    setLoaded(true);
    setOpen(true);
  }

  function warmPanel() {
    void import("./twin-chat-panel").catch(() => undefined);
  }

  function closeChat() {
    setOpen(false);
    window.requestAnimationFrame(() => {
      const trigger = triggerRef.current;

      if (trigger && document.contains(trigger)) {
        trigger.focus();
        return;
      }

      launcherRef.current?.focus();
    });
  }

  return (
    <>
      {(!open || !loaded) && !contactVisible ? (
        <button
          ref={launcherRef}
          type="button"
          onClick={openChat}
          onPointerEnter={warmPanel}
          onFocus={warmPanel}
          aria-haspopup="dialog"
          aria-controls="twin-chat-panel"
          aria-expanded={open}
          aria-label="Gemelo digital: preguntale a mi IA"
          className="group fixed bottom-4 right-4 z-30 flex items-center gap-3 rounded-full border border-line-strong bg-void/90 p-2 text-left shadow-2xl backdrop-blur-md transition-colors duration-300 hover:border-acid sm:bottom-6 sm:right-6 sm:py-2 sm:pl-2 sm:pr-4"
        >
          <span className="relative grid h-9 w-9 place-items-center rounded-full border border-acid/40 bg-panel transition-colors duration-300 group-hover:border-acid">
            <SparklesIcon className="h-4 w-4 text-acid" />
            <span className="pulse-dot absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-acid" />
          </span>
          <span className="hidden sm:block">
            <span className="block text-[12px] font-medium tracking-tight text-bone">
              Gemelo digital
            </span>
            <span className="block font-mono text-xs uppercase tracking-[0.16em] text-ash">
              Preguntale a mi IA
            </span>
          </span>
        </button>
      ) : null}

      {loaded ? <TwinChatPanel open={open} onClose={closeChat} /> : null}
    </>
  );
}
