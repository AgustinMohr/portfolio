"use client";

import { useEffect, useRef, useState } from "react";
import { copyTextToClipboard } from "@/lib/clipboard";
import { profile } from "@/lib/data";
import { openMailto } from "@/lib/mailto";
import { CheckIcon, CopyIcon } from "./icons";

export function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState("");
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  async function handleCopy() {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

    const copiedToClipboard = await copyTextToClipboard(profile.email);

    if (!copiedToClipboard) {
      setCopied(false);
      setFeedback("No se pudo copiar. Abriendo el cliente de email.");
      openMailto(profile.email);
      return;
    }

    setCopied(true);
    setFeedback("Email copiado");
    timeoutRef.current = window.setTimeout(() => {
      setCopied(false);
      setFeedback("");
    }, 2200);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        className="btn btn-ghost px-4 py-2.5 text-xs uppercase tracking-[0.16em]"
      >
        {copied ? (
          <CheckIcon className="h-3.5 w-3.5 text-acid" />
        ) : (
          <CopyIcon className="h-3.5 w-3.5" />
        )}
        {copied ? "Copiado" : "Copiar email"}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {feedback}
      </span>
    </>
  );
}
