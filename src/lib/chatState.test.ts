import { describe, it, expect } from "vitest";
import { getMessageText, shouldShowThinking } from "./chatState";

const user = { role: "user", parts: [{ type: "text", text: "Hi" }] };
const emptyAssistant = { role: "assistant", parts: [{ type: "step-start" }] };
const textAssistant = {
  role: "assistant",
  parts: [{ type: "step-start" }, { type: "text", text: "Hel" }, { type: "text", text: "lo" }],
};

describe("getMessageText", () => {
  it("joins text parts and ignores other parts", () => {
    expect(getMessageText(textAssistant)).toBe("Hello");
  });

  it("returns an empty string when there are no text parts", () => {
    expect(getMessageText(emptyAssistant)).toBe("");
  });
});

describe("shouldShowThinking", () => {
  it("is true right after sending", () => {
    expect(shouldShowThinking("submitted", [user])).toBe(true);
  });

  it("is true while streaming before the first token", () => {
    expect(shouldShowThinking("streaming", [user, emptyAssistant])).toBe(true);
  });

  it("is false once text has arrived", () => {
    expect(shouldShowThinking("streaming", [user, textAssistant])).toBe(false);
  });

  it("is false when idle or in error", () => {
    expect(shouldShowThinking("ready", [user, emptyAssistant])).toBe(false);
    expect(shouldShowThinking("error", [user])).toBe(false);
  });

  it("is false while streaming with no messages", () => {
    expect(shouldShowThinking("streaming", [])).toBe(false);
  });
});
