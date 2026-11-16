import { describe, expect, it } from "vitest";
import { seoDescription, seoTitle } from "@/lib/seo";

describe("seo copy", () => {
  it("keeps the description within the snippet length", () => {
    expect(seoDescription.length).toBeGreaterThanOrEqual(120);
    expect(seoDescription.length).toBeLessThanOrEqual(160);
  });

  it("names the person and the role in the title", () => {
    expect(seoTitle).toContain("Agustín Mohr Tschopp");
    expect(seoTitle).toContain("Backend");
    expect(seoTitle.length).toBeLessThanOrEqual(60);
  });
});
