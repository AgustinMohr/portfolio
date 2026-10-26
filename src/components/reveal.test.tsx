import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("Reveal", () => {
  it("uses a single shared IntersectionObserver", async () => {
    vi.resetModules();

    const observe = vi.fn();
    let instances = 0;

    class SpyObserver {
      readonly root = null;
      readonly rootMargin = "0px 0px 200px 0px";
      readonly thresholds = [0];

      observe = observe;
      unobserve = vi.fn();
      disconnect = vi.fn();
      takeRecords = () => [];

      constructor() {
        instances += 1;
      }
    }

    vi.stubGlobal("IntersectionObserver", SpyObserver);

    const { Reveal } = await import("@/components/reveal");

    render(
      <>
        <Reveal>A</Reveal>
        <Reveal>B</Reveal>
        <Reveal>C</Reveal>
      </>,
    );

    expect(instances).toBe(1);
    expect(observe).toHaveBeenCalledTimes(3);
  });
});
