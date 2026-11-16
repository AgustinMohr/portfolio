import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

function request(headers: Record<string, string> = {}) {
  return new Request("http://localhost:3100/api/twin", {
    method: "POST",
    headers,
  });
}

async function loadGuard() {
  vi.resetModules();
  return import("@/lib/twin-guard");
}

beforeEach(() => {
  vi.stubEnv("TWIN_RATE_LIMIT", "1");
  vi.stubEnv("TWIN_GLOBAL_RATE_LIMIT", "1000");
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("checkTwinRateLimit", () => {
  it("warns once in production when the proxy is not trusted", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("TWIN_TRUST_PROXY", "");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const { checkTwinRateLimit } = await loadGuard();

    await checkTwinRateLimit(request());
    await checkTwinRateLimit(request());

    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toContain("TWIN_TRUST_PROXY");
  });

  it("does not warn outside production", async () => {
    vi.stubEnv("TWIN_TRUST_PROXY", "");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const { checkTwinRateLimit } = await loadGuard();

    await checkTwinRateLimit(request());

    expect(warn).not.toHaveBeenCalled();
  });

  it("separates clients by forwarded address when the proxy is trusted", async () => {
    vi.stubEnv("TWIN_TRUST_PROXY", "true");
    const { checkTwinRateLimit } = await loadGuard();

    const first = await checkTwinRateLimit(
      request({ "x-forwarded-for": "203.0.113.1" }),
    );
    const second = await checkTwinRateLimit(
      request({ "x-forwarded-for": "203.0.113.2" }),
    );
    const repeat = await checkTwinRateLimit(
      request({ "x-forwarded-for": "203.0.113.1" }),
    );

    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(true);
    expect(repeat.allowed).toBe(false);
  });

  it("shares one bucket across visitors when the proxy is not trusted", async () => {
    vi.stubEnv("TWIN_TRUST_PROXY", "");
    const { checkTwinRateLimit } = await loadGuard();

    const first = await checkTwinRateLimit(
      request({ "x-forwarded-for": "203.0.113.1" }),
    );
    const second = await checkTwinRateLimit(
      request({ "x-forwarded-for": "203.0.113.2" }),
    );

    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(false);
  });
});
