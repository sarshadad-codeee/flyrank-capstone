import { describe, it, expect } from "vitest";
import {
  EmergencyReportError,
  FEEDBACK_CATEGORIES,
  FEEDBACK_CATEGORY_LABELS,
  draftFeedback,
  draftFeedbackInputSchema,
} from "./draftFeedback";

const valid = {
  category: "high_billing",
  urgency: "normal",
  summary: "My gas bill is much higher than usual this month.",
};

describe("draftFeedbackInputSchema", () => {
  it("accepts a minimal valid input", () => {
    expect(draftFeedbackInputSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts the optional fields", () => {
    const result = draftFeedbackInputSchema.safeParse({
      ...valid,
      details: "Bill dated 3 November, amount doubled.",
      desiredOutcome: "Please check my meter reading.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an unknown category", () => {
    expect(
      draftFeedbackInputSchema.safeParse({ ...valid, category: "weather" }).success
    ).toBe(false);
  });

  it("rejects an unknown urgency", () => {
    expect(
      draftFeedbackInputSchema.safeParse({ ...valid, urgency: "whenever" }).success
    ).toBe(false);
  });

  it("rejects a summary that is too short or too long", () => {
    expect(draftFeedbackInputSchema.safeParse({ ...valid, summary: "short" }).success).toBe(false);
    expect(
      draftFeedbackInputSchema.safeParse({ ...valid, summary: "x".repeat(301) }).success
    ).toBe(false);
  });

  it("trims the summary", () => {
    const result = draftFeedbackInputSchema.parse({
      ...valid,
      summary: "   A clear summary of the issue.   ",
    });
    expect(result.summary).toBe("A clear summary of the issue.");
  });
});

describe("draftFeedback", () => {
  it("returns the record with a readable category label", () => {
    const result = draftFeedback(draftFeedbackInputSchema.parse(valid));
    expect(result.categoryLabel).toBe("High billing");
    expect(result.urgency).toBe("normal");
    expect(result.summary).toBe(valid.summary);
  });

  it("leaves out optional fields that were not given", () => {
    const result = draftFeedback(draftFeedbackInputSchema.parse(valid));
    expect("details" in result).toBe(false);
    expect("desiredOutcome" in result).toBe(false);
  });

  it("keeps optional fields that were given", () => {
    const result = draftFeedback(
      draftFeedbackInputSchema.parse({ ...valid, details: "Since October.", desiredOutcome: "A refund." })
    );
    expect(result.details).toBe("Since October.");
    expect(result.desiredOutcome).toBe("A refund.");
  });

  it("refuses an emergency with a designed error", () => {
    const input = draftFeedbackInputSchema.parse({
      ...valid,
      category: "other",
      urgency: "emergency",
      summary: "I can smell gas in my kitchen right now.",
    });
    expect(() => draftFeedback(input)).toThrow(EmergencyReportError);
    expect(() => draftFeedback(input)).toThrow(/emergency/i);
  });

  it("has a label for every category", () => {
    for (const category of FEEDBACK_CATEGORIES) {
      expect(FEEDBACK_CATEGORY_LABELS[category].length).toBeGreaterThan(0);
    }
  });
});
