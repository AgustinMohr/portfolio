"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { observeReveal } from "@/lib/reveal-observer";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const revealWindow = window as Window & {
      __portfolioRevealReady?: boolean;
    };
    revealWindow.__portfolioRevealReady = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.classList.add("is-visible");
      return;
    }

    if (!("IntersectionObserver" in window)) {
      element.classList.add("is-visible");
      return;
    }

    return observeReveal(element, () => {
      element.classList.add("is-visible");
    });
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
