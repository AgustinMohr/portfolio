// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";

class SpyObserver {
  static instances: SpyObserver[] = [];

  readonly root = null;
  readonly rootMargin = "0px 0px 200px 0px";
  readonly thresholds = [0];

  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = () => [];

  constructor(private readonly callback: IntersectionObserverCallback) {
    SpyObserver.instances.push(this);
  }

  trigger(target: Element) {
    this.callback(
      [{ isIntersecting: true, target } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

describe("observeReveal", () => {
  beforeEach(() => {
    vi.resetModules();
    SpyObserver.instances = [];
    vi.stubGlobal("IntersectionObserver", SpyObserver);
  });

  it("shares one observer across every reveal element", async () => {
    const { observeReveal } = await import("@/lib/reveal-observer");
    const elements = [
      document.createElement("div"),
      document.createElement("div"),
      document.createElement("div"),
    ];
    const callbacks = elements.map(() => vi.fn());

    const cleanups = elements.map((element, index) =>
      observeReveal(element, callbacks[index]),
    );

    expect(SpyObserver.instances).toHaveLength(1);
    expect(SpyObserver.instances[0].observe).toHaveBeenCalledTimes(3);

    SpyObserver.instances[0].trigger(elements[1]);

    expect(callbacks[1]).toHaveBeenCalledTimes(1);
    expect(SpyObserver.instances[0].unobserve).toHaveBeenCalledWith(
      elements[1],
    );

    cleanups.forEach((cleanup) => cleanup());
  });
});
