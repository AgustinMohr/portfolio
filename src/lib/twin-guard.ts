const DEFAULT_WINDOW_MS = 10 * 60 * 1000;
const DEFAULT_PER_CLIENT_LIMIT = 30;
const DEFAULT_GLOBAL_LIMIT = 120;
const CLEANUP_INTERVAL_MS = 60_000;
const REDIS_TIMEOUT_MS = 2_000;
const RATE_PREFIX = "portfolio:twin:rate";

type Bucket = {
  count: number;
  resetAt: number;
};

export type RateLimitDecision = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
};

const buckets = new Map<string, Bucket>();
let lastCleanupAt = 0;
let redisWarningShown = false;
let proxyWarningShown = false;
let redisMissingWarningShown = false;

function numberFromEnv(name: string, fallback: number, minimum: number) {
  const parsed = Number(process.env[name]);
  if (!Number.isFinite(parsed) || parsed < minimum) return fallback;
  return Math.floor(parsed);
}

function getWindowMs() {
  return numberFromEnv(
    "TWIN_RATE_WINDOW_MS",
    DEFAULT_WINDOW_MS,
    1_000,
  );
}

function getPerClientLimit() {
  return numberFromEnv(
    "TWIN_RATE_LIMIT",
    DEFAULT_PER_CLIENT_LIMIT,
    1,
  );
}

function getGlobalLimit() {
  return numberFromEnv(
    "TWIN_GLOBAL_RATE_LIMIT",
    DEFAULT_GLOBAL_LIMIT,
    1,
  );
}

function cleanupExpired(now: number) {
  if (now - lastCleanupAt < CLEANUP_INTERVAL_MS) return;

  lastCleanupAt = now;

  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

function warnUntrustedProxy() {
  if (proxyWarningShown || process.env.NODE_ENV !== "production") return;

  proxyWarningShown = true;
  console.warn(
    "Twin rate limit: TWIN_TRUST_PROXY is not 'true', so every visitor shares one per-client bucket. Set it behind a trusted proxy (and TWIN_TRUSTED_PROXY_HOPS if needed).",
  );
}

function getRedisConfig() {
  const url = (
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  )?.replace(/\/+$/, "");
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  return url && token ? { url, token } : null;
}

function warnMissingRedis() {
  if (redisMissingWarningShown || process.env.NODE_ENV !== "production") {
    return;
  }

  redisMissingWarningShown = true;
  console.warn(
    "Twin rate limit: no Upstash Redis configured. Limits are per serverless instance and do not protect the chat on Vercel. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.",
  );
}

function readClientKey(request: Request) {
  if (process.env.TWIN_TRUST_PROXY !== "true") {
    warnUntrustedProxy();
    return "untrusted";
  }

  const hops = numberFromEnv("TWIN_TRUSTED_PROXY_HOPS", 1, 1);
  const forwarded = request.headers.get("x-forwarded-for");

  if (forwarded) {
    const chain = forwarded
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    if (chain.length > 0) {
      return chain[Math.max(0, chain.length - hops)];
    }
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function memoryIncrement(
  key: string,
  limit: number,
  windowMs: number,
  now: number,
) {
  const existing = buckets.get(key);
  const bucket =
    !existing || existing.resetAt <= now
      ? { count: 0, resetAt: now + windowMs }
      : existing;

  bucket.count += 1;
  buckets.set(key, bucket);

  return {
    count: bucket.count,
    limit,
    remaining: Math.max(0, limit - bucket.count),
    resetAt: bucket.resetAt,
  };
}

function memoryDecision(
  clientKey: string,
  perClientLimit: number,
  globalLimit: number,
  windowMs: number,
  now: number,
): RateLimitDecision {
  cleanupExpired(now);

  const perClient = memoryIncrement(
    `client:${clientKey}`,
    perClientLimit,
    windowMs,
    now,
  );
  const global = memoryIncrement(
    "global",
    globalLimit,
    windowMs,
    now,
  );

  const perClientLimited = perClient.count > perClient.limit;
  const globalLimited = global.count > global.limit;
  const binding = perClientLimited
    ? perClient
    : globalLimited
      ? global
      : perClient;

  return {
    allowed: !perClientLimited && !globalLimited,
    limit: binding.limit,
    remaining: Math.max(
      0,
      Math.min(perClient.remaining, global.remaining),
    ),
    resetAt: binding.resetAt,
    retryAfterSeconds: Math.max(
      1,
      Math.ceil((binding.resetAt - now) / 1000),
    ),
  };
}

async function redisDecision(
  clientKey: string,
  perClientLimit: number,
  globalLimit: number,
  windowMs: number,
  now: number,
): Promise<RateLimitDecision | null> {
  const redis = getRedisConfig();

  if (!redis) {
    warnMissingRedis();
    return null;
  }

  const { url, token } = redis;

  const windowBucket = Math.floor(now / windowMs);
  const windowEnd = (windowBucket + 1) * windowMs;
  const clientRedisKey = `${RATE_PREFIX}:client:${clientKey}:${windowBucket}`;
  const globalRedisKey = `${RATE_PREFIX}:global:${windowBucket}`;

  try {
    const response = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", clientRedisKey],
        ["PEXPIRE", clientRedisKey, String(windowMs)],
        ["INCR", globalRedisKey],
        ["PEXPIRE", globalRedisKey, String(windowMs)],
      ]),
      signal: AbortSignal.timeout(REDIS_TIMEOUT_MS),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Upstash rate limit HTTP ${response.status}`);
    }

    const data = (await response.json()) as { result?: unknown }[];
    const perClientCount = Number(data[0]?.result);
    const globalCount = Number(data[2]?.result);

    if (
      !Number.isFinite(perClientCount) ||
      !Number.isFinite(globalCount)
    ) {
      throw new Error("Upstash rate limit returned an invalid payload");
    }

    const perClientLimited = perClientCount > perClientLimit;
    const globalLimited = globalCount > globalLimit;

    return {
      allowed: !perClientLimited && !globalLimited,
      limit: perClientLimited
        ? perClientLimit
        : globalLimited
          ? globalLimit
          : perClientLimit,
      remaining: Math.max(
        0,
        Math.min(
          perClientLimit - perClientCount,
          globalLimit - globalCount,
        ),
      ),
      resetAt: windowEnd,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((windowEnd - now) / 1000),
      ),
    };
  } catch (error) {
    if (!redisWarningShown) {
      redisWarningShown = true;
      console.warn(
        "Twin rate limit: Upstash unavailable, using in-memory fallback",
        error,
      );
    }

    return null;
  }
}

export function isTwinOriginAllowed(request: Request) {
  const origin = request.headers.get("origin");
  const allowed = new Set<string>([new URL(request.url).origin]);

  for (const value of (process.env.TWIN_ALLOWED_ORIGINS ?? "").split(",")) {
    const trimmed = value.trim();
    if (!trimmed) continue;

    try {
      allowed.add(new URL(trimmed).origin);
    } catch {
      void 0;
    }
  }

  const publicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (publicSiteUrl) {
    try {
      allowed.add(new URL(publicSiteUrl).origin);
    } catch {
      void 0;
    }
  }

  if (origin) {
    try {
      return allowed.has(new URL(origin).origin);
    } catch {
      return false;
    }
  }

  if (request.headers.get("sec-fetch-site") === "same-origin") {
    return true;
  }

  return process.env.TWIN_ALLOW_NO_ORIGIN === "true";
}

export async function checkTwinRateLimit(
  request: Request,
): Promise<RateLimitDecision> {
  const now = Date.now();
  const windowMs = getWindowMs();
  const perClientLimit = getPerClientLimit();
  const globalLimit = getGlobalLimit();
  const clientKey = readClientKey(request);

  const durable = await redisDecision(
    clientKey,
    perClientLimit,
    globalLimit,
    windowMs,
    now,
  );

  if (durable) return durable;

  return memoryDecision(
    clientKey,
    perClientLimit,
    globalLimit,
    windowMs,
    now,
  );
}
