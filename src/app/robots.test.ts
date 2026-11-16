import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import { siteUrl } from "@/lib/site";

describe("robots", () => {
  it("points crawlers to the canonical sitemap and blocks the API", () => {
    const result = robots();

    expect(result.sitemap).toBe(`${siteUrl}/sitemap.xml`);
    expect(result.rules).toMatchObject({
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    });
  });
});
