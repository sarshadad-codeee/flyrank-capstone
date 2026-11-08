import { describe, it, expect } from "vitest";
import { STREAM_ERROR_TEXT, describeStreamError } from "./streamError";
import { EmergencyReportError } from "./tools/draftFeedback";

describe("describeStreamError", () => {
  it("passes the emergency message through", () => {
    const text = describeStreamError(new EmergencyReportError());
    expect(text).toMatch(/emergency/i);
    expect(text).not.toBe(STREAM_ERROR_TEXT);
  });

  it("recognises an emergency error by name", () => {
    const error = new Error("Please leave the area.");
    error.name = "EmergencyReportError";
    expect(describeStreamError(error)).toBe("Please leave the area.");
  });

  it("hides the details of any other error", () => {
    expect(describeStreamError(new Error("provider secret detail"))).toBe(STREAM_ERROR_TEXT);
  });

  it("handles values that are not errors", () => {
    expect(describeStreamError("boom")).toBe(STREAM_ERROR_TEXT);
    expect(describeStreamError(undefined)).toBe(STREAM_ERROR_TEXT);
  });
});
