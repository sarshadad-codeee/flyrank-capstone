import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { POST } from "./route";
import {
  CHAT_MODEL,
  MAX_OUTPUT_TOKENS,
  MAX_TOOL_STEPS,
  RATE_LIMIT_MAX,
  SYSTEM_PROMPT,
} from "@/lib/chatConfig";
import { EmergencyReportError } from "@/lib/tools/draftFeedback";

vi.mock("ai", () => ({
  streamText: vi.fn(),
  convertToModelMessages: vi.fn(async (messages: unknown) => messages),
  stepCountIs: vi.fn((count: number) => ({ stepCount: count })),
  tool: (definition: unknown) => definition,
}));

vi.mock("@ai-sdk/google", () => ({
  google: vi.fn((id: string) => ({ modelId: id })),
}));

interface ResponseOptions {
  onError?: (error: unknown) => string;
}

const toResponse = vi.fn((options?: ResponseOptions) => {
  void options;
  return new Response("stream");
});

let visitor = 0;

function post(body: string, ip?: string): Request {
  visitor += 1;
  return new Request("http://localhost/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip ?? "10.0.0." + visitor,
    },
    body,
  });
}

const goodBody = JSON.stringify({
  messages: [{ id: "u1", role: "user", parts: [{ type: "text", text: "Hi" }] }],
});

beforeEach(() => {
  vi.stubEnv("GOOGLE_GENERATIVE_AI_API_KEY", "test-key-not-real");
  vi.mocked(streamText).mockReset();
  vi.mocked(google).mockClear();
  toResponse.mockClear();
  vi.mocked(streamText).mockReturnValue({
    toUIMessageStreamResponse: toResponse,
  } as unknown as ReturnType<typeof streamText>);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("POST /api/chat", () => {
  it("returns 500 without calling the model when the key is missing", async () => {
    vi.stubEnv("GOOGLE_GENERATIVE_AI_API_KEY", "");
    const response = await POST(post(goodBody));
    expect(response.status).toBe(500);
    expect(streamText).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid JSON without calling the model", async () => {
    const response = await POST(post("{not json"));
    expect(response.status).toBe(400);
    expect(streamText).not.toHaveBeenCalled();
  });

  it("returns 400 for a body with no messages without calling the model", async () => {
    const response = await POST(post(JSON.stringify({})));
    expect(response.status).toBe(400);
    expect(streamText).not.toHaveBeenCalled();
  });

  it("returns 413 for an oversize body without calling the model", async () => {
    const response = await POST(post("x".repeat(100_001)));
    expect(response.status).toBe(413);
    expect(streamText).not.toHaveBeenCalled();
  });

  it("streams for a valid request using the config and the request signal", async () => {
    const response = await POST(post(goodBody));
    expect(response.status).toBe(200);
    expect(google).toHaveBeenCalledWith(CHAT_MODEL);
    expect(streamText).toHaveBeenCalledTimes(1);
    const options = vi.mocked(streamText).mock.calls[0][0];
    expect(options.system).toBe(SYSTEM_PROMPT);
    expect(options.maxOutputTokens).toBe(MAX_OUTPUT_TOKENS);
    expect(options.abortSignal).toBeInstanceOf(AbortSignal);
  });

  it("registers the draftFeedback tool with a step limit", async () => {
    await POST(post(goodBody));
    const options = vi.mocked(streamText).mock.calls[0][0];
    expect(Object.keys(options.tools ?? {})).toEqual(["draftFeedback"]);
    expect(options.stopWhen).toEqual({ stepCount: MAX_TOOL_STEPS });
  });

  it("shows the emergency message but hides other errors", async () => {
    await POST(post(goodBody));
    const options = toResponse.mock.calls[0][0];
    expect(options?.onError?.(new EmergencyReportError())).toMatch(/emergency/i);
    expect(options?.onError?.(new Error("provider secret detail"))).not.toContain("secret");
  });

  it("returns 429 with Retry-After once a visitor passes the limit", async () => {
    for (let i = 0; i < RATE_LIMIT_MAX; i++) {
      const ok = await POST(post(goodBody, "9.9.9.9"));
      expect(ok.status).toBe(200);
    }
    const blocked = await POST(post(goodBody, "9.9.9.9"));
    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers.get("Retry-After"))).toBeGreaterThan(0);
    expect(streamText).toHaveBeenCalledTimes(RATE_LIMIT_MAX);
  });

  it("never puts the key in an error response", async () => {
    const response = await POST(post("{not json"));
    const text = await response.text();
    expect(text).not.toContain("test-key-not-real");
  });
});
