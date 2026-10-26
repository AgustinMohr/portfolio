import { describe, expect, it } from "vitest";
import { isNearBottom } from "@/lib/scroll";

describe("isNearBottom", () => {
  it("returns true at the bottom and within the threshold", () => {
    expect(
      isNearBottom({ scrollHeight: 1000, scrollTop: 600, clientHeight: 400 }),
    ).toBe(true);
    expect(
      isNearBottom({ scrollHeight: 1000, scrollTop: 520, clientHeight: 400 }),
    ).toBe(true);
  });

  it("returns false when the reader scrolled up", () => {
    expect(
      isNearBottom({ scrollHeight: 1000, scrollTop: 100, clientHeight: 400 }),
    ).toBe(false);
  });
});
