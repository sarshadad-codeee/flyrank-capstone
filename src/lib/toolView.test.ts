import { describe, it, expect } from "vitest";
import { getToolView, humanize, pickFields, readToolPart } from "./toolView";

const goodOutput = {
  category: "high_billing",
  categoryLabel: "High billing",
  urgency: "normal",
  summary: "My gas bill doubled this month.",
};

describe("getToolView", () => {
  it("shows drafting while the input streams, with fields so far", () => {
    const view = getToolView({ state: "input-streaming", input: { category: "high_billing" } });
    expect(view).toEqual({ kind: "drafting", fields: { category: "high_billing" } });
  });

  it("handles an input that has not started", () => {
    expect(getToolView({ state: "input-streaming" })).toEqual({ kind: "drafting", fields: {} });
  });

  it("shows working once the input is complete", () => {
    const view = getToolView({ state: "input-available", input: { summary: "A summary here." } });
    expect(view.kind).toBe("working");
  });

  it("shows the result when the output is valid", () => {
    const view = getToolView({ state: "output-available", output: goodOutput });
    expect(view.kind).toBe("result");
  });

  it("turns an unreadable output into the error view, not a crash", () => {
    const view = getToolView({ state: "output-available", output: { nope: true } });
    expect(view.kind).toBe("error");
    expect(getToolView({ state: "output-available" }).kind).toBe("error");
  });

  it("shows the error text and flags an emergency", () => {
    const view = getToolView({
      state: "output-error",
      errorText: "This sounds like an emergency, so it cannot be filed.",
    });
    expect(view).toEqual({
      kind: "error",
      message: "This sounds like an emergency, so it cannot be filed.",
      emergency: true,
    });
  });

  it("uses a generic message when the error text is missing", () => {
    const view = getToolView({ state: "output-error" });
    expect(view.kind === "error" && view.emergency).toBe(false);
    expect(view.kind === "error" && view.message.length > 0).toBe(true);
  });

  it("does not render approval states", () => {
    expect(getToolView({ state: "approval-requested" }).kind).toBe("unsupported");
    expect(getToolView({ state: "output-denied" }).kind).toBe("unsupported");
  });
});

describe("pickFields", () => {
  it("keeps only non-empty strings", () => {
    expect(pickFields({ category: "other", summary: "  ", details: 5, urgency: "low" })).toEqual({
      category: "other",
      urgency: "low",
    });
  });

  it("returns nothing for a value that is not an object", () => {
    expect(pickFields(null)).toEqual({});
    expect(pickFields("text")).toEqual({});
  });
});

describe("readToolPart", () => {
  it("reads the draftFeedback part", () => {
    const part = readToolPart({ type: "tool-draftFeedback", state: "output-error", errorText: "x" });
    expect(part).toEqual({ state: "output-error", input: undefined, output: undefined, errorText: "x" });
  });

  it("ignores other parts and tools", () => {
    expect(readToolPart({ type: "text", text: "hi" })).toBeNull();
    expect(readToolPart({ type: "tool-other", state: "output-available" })).toBeNull();
    expect(readToolPart({ type: "tool-draftFeedback" })).toBeNull();
  });
});

describe("humanize", () => {
  it("makes a snake case value readable", () => {
    expect(humanize("name_or_address_correction")).toBe("Name or address correction");
  });
});
