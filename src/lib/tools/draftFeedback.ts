import { tool } from "ai";
import { z } from "zod";

/**
 * draftFeedback: turns what a customer described into a structured
 * feedback record that the UI renders as a summary card.
 *
 * Contract (also documented in the README):
 *   input  -> category, urgency, summary, optional details, optional desiredOutcome
 *   output -> the same record plus a readable categoryLabel
 *   error  -> thrown for an emergency urgency, because a gas smell or
 *             leak must not be filed as feedback
 *
 * Keep the schema small: every field is a field the model can invent.
 */

export const FEEDBACK_CATEGORIES = [
  "bill_installment",
  "duplicate_bill",
  "name_or_address_correction",
  "bank_query",
  "high_billing",
  "other",
] as const;

export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];

export const FEEDBACK_CATEGORY_LABELS: Record<FeedbackCategory, string> = {
  bill_installment: "Bill installment",
  duplicate_bill: "Duplicate bill",
  name_or_address_correction: "Name or address correction",
  bank_query: "Bank query",
  high_billing: "High billing",
  other: "Other",
};

export const FEEDBACK_URGENCIES = ["low", "normal", "high", "emergency"] as const;

export type FeedbackUrgency = (typeof FEEDBACK_URGENCIES)[number];

export type FiledUrgency = Exclude<FeedbackUrgency, "emergency">;

export const draftFeedbackInputSchema = z.object({
  category: z
    .enum(FEEDBACK_CATEGORIES)
    .describe("The kind of service issue the customer described."),
  urgency: z
    .enum(FEEDBACK_URGENCIES)
    .describe(
      "How urgent it is. Use emergency only for a gas smell, a leak or a safety danger."
    ),
  summary: z
    .string()
    .trim()
    .min(10)
    .max(300)
    .describe("One or two plain sentences describing the issue, in the customer's words."),
  details: z
    .string()
    .trim()
    .max(500)
    .optional()
    .describe("Extra facts such as dates, amounts or locations. Leave out if none were given."),
  desiredOutcome: z
    .string()
    .trim()
    .max(200)
    .optional()
    .describe("What the customer wants to happen. Leave out if they did not say."),
});

export type DraftFeedbackInput = z.infer<typeof draftFeedbackInputSchema>;

export interface DraftFeedbackResult {
  category: FeedbackCategory;
  categoryLabel: string;
  urgency: FiledUrgency;
  summary: string;
  details?: string;
  desiredOutcome?: string;
}

/** Thrown when the model tries to file an emergency as feedback. */
export class EmergencyReportError extends Error {
  constructor() {
    super(
      "This sounds like an emergency, so it cannot be filed as feedback. Leave the area, avoid switches and flames, and call the emergency line or local emergency services."
    );
    this.name = "EmergencyReportError";
  }
}

/** The tool's logic, kept separate from the SDK wrapper so it is easy to test. */
export function draftFeedback(input: DraftFeedbackInput): DraftFeedbackResult {
  const { urgency } = input;
  if (urgency === "emergency") {
    throw new EmergencyReportError();
  }

  const result: DraftFeedbackResult = {
    category: input.category,
    categoryLabel: FEEDBACK_CATEGORY_LABELS[input.category],
    urgency,
    summary: input.summary,
  };
  if (input.details) result.details = input.details;
  if (input.desiredOutcome) result.desiredOutcome = input.desiredOutcome;
  return result;
}

export const draftFeedbackTool = tool({
  description:
    "Draft a structured feedback record once the customer has described a gas service issue clearly enough to summarise. Do not call it for emergencies or for small talk.",
  inputSchema: draftFeedbackInputSchema,
  execute: async (input) => draftFeedback(input),
});
