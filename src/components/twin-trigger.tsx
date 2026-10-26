"use client";

import { TWIN_OPEN_EVENT } from "@/lib/twin";
import { ArrowUpRight, SparklesIcon } from "./icons";

export function TwinTrigger({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      data-twin-trigger
      onClick={() => window.dispatchEvent(new Event(TWIN_OPEN_EVENT))}
      className={`btn btn-ghost px-4 py-2.5 text-[10px] uppercase tracking-[0.16em] ${className}`}
    >
      <SparklesIcon className="h-3.5 w-3.5 text-acid" />
      Abrir gemelo digital
      <ArrowUpRight className="h-3.5 w-3.5" />
    </button>
  );
}
