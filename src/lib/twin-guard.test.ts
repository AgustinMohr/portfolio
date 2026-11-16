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

    const proxyWarnings = warn.mock.calls.filter((call) =>
      String(call[0]).includes("TWIN_TRUST_PROXY"),
    );
    expect(proxyWarnings).toHaveLength(1);
  });

  it("warns once in production when Upstash is not configured", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("TWIN_TRUST_PROXY", "true");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const { checkTwinRateLimit } = await loadGuard();

    await checkTwinRateLimit(request({ "x-forwarded-for": "203.0.113.9" }));
    await checkTwinRateLimit(request({ "x-forwarded-for": "203.0.113.9" }));

    const messages = warn.mock.calls.map((call) => String(call[0]));
    expect(messages.filter((m) => m.includes("Upstash"))).toHaveLength(1);
  });

  it("uses Vercel KV variable names when Upstash ones are missing", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("TWIN_TRUST_PROXY", "true");
    vi.stubEnv("KV_REST_API_URL", "https://redis.example/");
    vi.stubEnv("KV_REST_API_TOKEN", "token");
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json([
        { result: 1 },
        { result: 1 },
        { result: 1 },
        { result: 1 },
      ]),
    );
    vi.stubGlobal("fetch", fetchMock);
    const { checkTwinRateLimit } = await loadGuard();

    const decision = await checkTwinRateLimit(
      request({ "x-forwarded-for": "203.0.113.9" }),
    );

    expect(decision.allowed).toBe(true);
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
      "https://redis.example/pipeline",
    );
    vi.unstubAllGlobals();
  });

  it("never sends the raw client address to Redis", async () => {
    vi.stubEnv("TWIN_TRUST_PROXY", "true");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token");
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json([
        { result: 1 },
        { result: 1 },
        { result: 1 },
        { result: 1 },
      ]),
    );
    vi.stubGlobal("fetch", fetchMock);
    const { checkTwinRateLimit } = await loadGuard();

    await checkTwinRateLimit(request({ "x-forwarded-for": "203.0.113.77" }));

    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(String(init.body)).not.toContain("203.0.113.77");
    expect(String(init.body)).toContain("portfolio:twin:rate:client:");
    vi.unstubAllGlobals();
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
