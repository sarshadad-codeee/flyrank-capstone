import { describe, it, expect } from "vitest";
import { createRateLimiter, getClientKey } from "./rateLimit";
import { RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS } from "./chatConfig";

describe("createRateLimiter", () => {
  it("allows requests up to the limit and then blocks", () => {
    let time = 1000;
    const limiter = createRateLimiter({ limit: 3, windowMs: 60_000, now: () => time });
    expect(limiter.check("a").allowed).toBe(true);
    expect(limiter.check("a").allowed).toBe(true);
    expect(limiter.check("a").allowed).toBe(true);
    const blocked = limiter.check("a");
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
    time += 1;
  });

  it("allows again after the window passes", () => {
    let time = 0;
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: () => time });
    expect(limiter.check("a").allowed).toBe(true);
    expect(limiter.check("a").allowed).toBe(false);
    time = 1000;
    expect(limiter.check("a").allowed).toBe(true);
  });

  it("counts each visitor separately", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 60_000, now: () => 0 });
    expect(limiter.check("a").allowed).toBe(true);
    expect(limiter.check("b").allowed).toBe(true);
    expect(limiter.check("a").allowed).toBe(false);
  });

  it("uses sensible configured limits", () => {
    expect(RATE_LIMIT_MAX).toBeGreaterThan(0);
    expect(RATE_LIMIT_WINDOW_MS).toBeGreaterThan(0);
  });
});

describe("getClientKey", () => {
  it("uses the first x-forwarded-for address", () => {
    const headers = new Headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" });
    expect(getClientKey(headers)).toBe("1.2.3.4");
  });

  it("falls back to x-real-ip", () => {
    expect(getClientKey(new Headers({ "x-real-ip": "9.9.9.9" }))).toBe("9.9.9.9");
  });

  it("returns unknown when no header is present", () => {
    expect(getClientKey(new Headers())).toBe("unknown");
  });
});
