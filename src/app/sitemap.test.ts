import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { siteUrl } from "@/lib/site";

describe("sitemap", () => {
  it("lists the home and the privacy page with a modification date", () => {
    const entries = sitemap();

    expect(entries.map((entry) => entry.url)).toEqual([
      siteUrl,
      `${siteUrl}/privacidad`,
    ]);
    for (const entry of entries) {
      expect(entry.lastModified).toBeInstanceOf(Date);
    }
  });
});
