import { describe, it, expect } from "vitest";
import { CHAT_MODEL, MAX_OUTPUT_TOKENS, SYSTEM_PROMPT } from "./chatConfig";

describe("chat config", () => {
  it("keeps the system prompt ASCII-only", () => {
    expect(/^[ -~\n]*$/.test(SYSTEM_PROMPT)).toBe(true);
  });

  it("never contains the incharge address", () => {
    expect(SYSTEM_PROMPT.toLowerCase()).not.toContain("incharge@");
  });

  it("tells the model to send people away from a gas smell", () => {
    expect(SYSTEM_PROMPT.toLowerCase()).toContain("leave the area");
  });

  it("sets a model and a positive output cap", () => {
    expect(CHAT_MODEL.length).toBeGreaterThan(0);
    expect(MAX_OUTPUT_TOKENS).toBeGreaterThan(0);
  });
});
