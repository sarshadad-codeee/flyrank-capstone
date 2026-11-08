export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export interface RateLimiter {
  check: (key: string) => RateLimitResult;
}

interface RateLimiterOptions {
  limit: number;
  windowMs: number;
  now?: () => number;
}

interface Entry {
  count: number;
  resetAt: number;
}

const PRUNE_AT = 500;

/**
 * Fixed-window limiter kept in memory. On a serverless host each
 * instance has its own memory, so this is a best-effort guard and not
 * a hard cap.
 */
export function createRateLimiter(options: RateLimiterOptions): RateLimiter {
  const { limit, windowMs } = options;
  const now = options.now ?? (() => Date.now());
  const entries = new Map<string, Entry>();

  function prune(time: number) {
    for (const [key, entry] of entries) {
      if (time >= entry.resetAt) entries.delete(key);
    }
  }

  return {
    check(key: string): RateLimitResult {
      const time = now();
      if (entries.size > PRUNE_AT) prune(time);

      const entry = entries.get(key);
      if (entry === undefined || time >= entry.resetAt) {
        entries.set(key, { count: 1, resetAt: time + windowMs });
        return { allowed: true, retryAfterSeconds: 0 };
      }
      if (entry.count >= limit) {
        return {
          allowed: false,
          retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - time) / 1000)),
        };
      }
      entry.count += 1;
      return { allowed: true, retryAfterSeconds: 0 };
    },
  };
}

/** Picks a visitor key from proxy headers, or "unknown" if none is set. */
export function getClientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0].trim();
    if (first) return first;
  }
  const real = headers.get("x-real-ip");
  if (real && real.trim()) return real.trim();
  return "unknown";
}
