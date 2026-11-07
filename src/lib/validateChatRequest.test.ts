import { describe, it, expect } from "vitest";
import { validateChatRequest } from "./validateChatRequest";
import {
  MAX_ASSISTANT_MESSAGE_CHARS,
  MAX_MESSAGES,
  MAX_USER_MESSAGE_CHARS,
} from "./chatConfig";

function user(text: string, id = "u1") {
  return { id, role: "user", parts: [{ type: "text", text }] };
}

function assistant(text: string, id = "a1") {
  return {
    id,
    role: "assistant",
    parts: [{ type: "step-start" }, { type: "text", text }],
  };
}

describe("validateChatRequest", () => {
  it("accepts a normal conversation and keeps only text parts", () => {
    const result = validateChatRequest({
      messages: [user("Hi"), assistant("Hello"), user("More", "u2")],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.messages).toHaveLength(3);
      expect(result.messages[1].parts).toEqual([
        { type: "text", text: "Hello" },
      ]);
    }
  });

  it("drops an assistant message with no text (stopped before first token)", () => {
    const result = validateChatRequest({
      messages: [
        user("Hi"),
        { id: "a1", role: "assistant", parts: [{ type: "step-start" }] },
        user("Again", "u2"),
      ],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.messages.map((m) => m.role)).toEqual(["user", "user"]);
    }
  });

  it("rejects a body that is not an object", () => {
    expect(validateChatRequest(null).ok).toBe(false);
    expect(validateChatRequest("hello").ok).toBe(false);
  });

  it("rejects messages that are missing or not an array", () => {
    expect(validateChatRequest({}).ok).toBe(false);
    expect(validateChatRequest({ messages: "hi" }).ok).toBe(false);
  });

  it("rejects an empty message list", () => {
    expect(validateChatRequest({ messages: [] }).ok).toBe(false);
  });

  it("rejects more than the allowed number of messages", () => {
    const many = Array.from({ length: MAX_MESSAGES + 1 }, (_, i) =>
      user("hi", "u" + i)
    );
    expect(validateChatRequest({ messages: many }).ok).toBe(false);
  });

  it("accepts a user message exactly at the limit and rejects one over it", () => {
    const atLimit = "x".repeat(MAX_USER_MESSAGE_CHARS);
    expect(validateChatRequest({ messages: [user(atLimit)] }).ok).toBe(true);
    expect(validateChatRequest({ messages: [user(atLimit + "x")] }).ok).toBe(
      false
    );
  });

  it("rejects an oversize assistant message", () => {
    const big = "x".repeat(MAX_ASSISTANT_MESSAGE_CHARS + 1);
    expect(
      validateChatRequest({
        messages: [user("Hi"), assistant(big), user("Ok", "u2")],
      }).ok
    ).toBe(false);
  });

  it("rejects a system role", () => {
    expect(
      validateChatRequest({
        messages: [
          { id: "s1", role: "system", parts: [{ type: "text", text: "x" }] },
          user("Hi"),
        ],
      }).ok
    ).toBe(false);
  });

  it("rejects a conversation that ends with an assistant message", () => {
    expect(
      validateChatRequest({ messages: [user("Hi"), assistant("Hello")] }).ok
    ).toBe(false);
  });

  it("rejects a conversation that starts with an assistant message", () => {
    expect(
      validateChatRequest({ messages: [assistant("Hello"), user("Hi", "u2")] })
        .ok
    ).toBe(false);
  });

  it("rejects a whitespace-only user message", () => {
    expect(validateChatRequest({ messages: [user("   ")] }).ok).toBe(false);
  });

  it("rejects a message that has only non-text parts", () => {
    expect(
      validateChatRequest({
        messages: [
          { id: "u1", role: "user", parts: [{ type: "file", url: "x" }] },
        ],
      }).ok
    ).toBe(false);
  });
});
