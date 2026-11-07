import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { POST } from "./route";
import { CHAT_MODEL, MAX_OUTPUT_TOKENS, SYSTEM_PROMPT } from "@/lib/chatConfig";

vi.mock("ai", () => ({
  streamText: vi.fn(),
  convertToModelMessages: vi.fn(async (messages: unknown) => messages),
}));

vi.mock("@ai-sdk/anthropic", () => ({
  anthropic: vi.fn((id: string) => ({ modelId: id })),
}));

function post(body: string): Request {
  return new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}

const goodBody = JSON.stringify({
  messages: [{ id: "u1", role: "user", parts: [{ type: "text", text: "Hi" }] }],
});

beforeEach(() => {
  vi.stubEnv("ANTHROPIC_API_KEY", "test-key-not-real");
  vi.mocked(streamText).mockReset();
  vi.mocked(anthropic).mockClear();
  vi.mocked(streamText).mockReturnValue({
    toUIMessageStreamResponse: () => new Response("stream"),
  } as unknown as ReturnType<typeof streamText>);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("POST /api/chat", () => {
  it("returns 500 without calling the model when the key is missing", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");
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
    expect(anthropic).toHaveBeenCalledWith(CHAT_MODEL);
    expect(streamText).toHaveBeenCalledTimes(1);
    const options = vi.mocked(streamText).mock.calls[0][0];
    expect(options.system).toBe(SYSTEM_PROMPT);
    expect(options.maxOutputTokens).toBe(MAX_OUTPUT_TOKENS);
    expect(options.abortSignal).toBeInstanceOf(AbortSignal);
  });

  it("never puts the key in an error response", async () => {
    const response = await POST(post("{not json"));
    const text = await response.text();
    expect(text).not.toContain("test-key-not-real");
  });
});
