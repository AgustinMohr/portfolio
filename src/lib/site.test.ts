import { afterEach, describe, expect, it, vi } from "vitest";

async function loadSiteUrl() {
  vi.resetModules();
  return (await import("@/lib/site")).siteUrl;
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("siteUrl", () => {
  it("prefers NEXT_PUBLIC_SITE_URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://agustinmohr.com/");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "app.vercel.app");

    expect(await loadSiteUrl()).toBe("https://agustinmohr.com");
  });

  it("falls back to the Vercel production host", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "app.vercel.app");

    expect(await loadSiteUrl()).toBe("https://app.vercel.app");
  });

  it("fails in production without any configured origin", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");

    await expect(loadSiteUrl()).rejects.toThrow("NEXT_PUBLIC_SITE_URL");
  });
});
