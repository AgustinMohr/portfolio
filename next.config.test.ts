import { describe, expect, it } from "vitest";
import nextConfig from "./next.config";

describe("security headers", () => {
  it("sets a CSP and the hardening headers", async () => {
    expect(nextConfig.poweredByHeader).toBe(false);

    const rules = await nextConfig.headers?.();
    expect(rules).toHaveLength(1);

    const headers = new Map(
      rules?.[0].headers.map((header) => [header.key, header.value]),
    );

    expect(headers.get("Content-Security-Policy")).toContain(
      "default-src 'self'",
    );
    expect(headers.get("Content-Security-Policy")).toContain(
      "frame-ancestors 'none'",
    );
    expect(headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(headers.get("Referrer-Policy")).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(headers.get("Permissions-Policy")).toContain("camera=()");
    expect(headers.get("X-Frame-Options")).toBe("DENY");
    expect(headers.get("Cross-Origin-Opener-Policy")).toBe("same-origin");
    expect(headers.get("Strict-Transport-Security")).toContain("max-age=");
  });
});
