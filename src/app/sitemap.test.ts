import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { siteUrl } from "@/lib/site";

describe("sitemap", () => {
  it("uses the canonical site URL", () => {
    const entries = sitemap();

    expect(entries).toHaveLength(1);
    expect(entries[0].url).toBe(siteUrl);
    expect(entries[0].changeFrequency).toBe("monthly");
    expect(entries[0].priority).toBe(1);
  });
});
