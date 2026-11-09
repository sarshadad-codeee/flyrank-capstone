import { z } from "zod";

/** The parts of a tool part this page reads. */
export interface ToolPartLike {
  state: string;
  input?: unknown;
  output?: unknown;
  errorText?: string;
}

export interface DraftFields {
  category?: string;
  urgency?: string;
  summary?: string;
  details?: string;
  desiredOutcome?: string;
}

const resultSchema = z.object({
  category: z.string(),
  categoryLabel: z.string(),
  urgency: z.enum(["low", "normal", "high"]),
  summary: z.string(),
  details: z.string().optional(),
  desiredOutcome: z.string().optional(),
});

export type ToolResult = z.infer<typeof resultSchema>;

/**
 * What the card should show. Each kind answers a different question:
 * drafting: what is it doing? working: with what input?
 * result: what came back? error: what went wrong?
 */
export type ToolView =
  | { kind: "drafting"; fields: DraftFields }
  | { kind: "working"; fields: DraftFields }
  | { kind: "result"; result: ToolResult }
  | { kind: "error"; message: string; emergency: boolean }
  | { kind: "unsupported" };

const FIELD_KEYS = [
  "category",
  "urgency",
  "summary",
  "details",
  "desiredOutcome",
] as const;

const GENERIC_ERROR = "The draft could not be created.";
const UNREADABLE = "The draft came back in a format this page could not read.";

/** Turns a value like high_billing into High billing. */
export function humanize(value: string): string {
  const spaced = value.replace(/_/g, " ").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** Keeps only non-empty string fields, so a half-streamed input is safe. */
export function pickFields(input: unknown): DraftFields {
  const fields: DraftFields = {};
  if (typeof input !== "object" || input === null) return fields;
  const source = input as Record<string, unknown>;
  for (const key of FIELD_KEYS) {
    const value = source[key];
    if (typeof value === "string" && value.trim() !== "") fields[key] = value;
  }
  return fields;
}

/** Returns the draftFeedback tool part from a message part, or null. */
export function readToolPart(part: object): ToolPartLike | null {
  const source = part as Record<string, unknown>;
  if (source.type !== "tool-draftFeedback") return null;
  if (typeof source.state !== "string") return null;
  return {
    state: source.state,
    input: source.input,
    output: source.output,
    errorText: typeof source.errorText === "string" ? source.errorText : undefined,
  };
}

export function getToolView(tool: ToolPartLike): ToolView {
  switch (tool.state) {
    case "input-streaming":
      return { kind: "drafting", fields: pickFields(tool.input) };
    case "input-available":
      return { kind: "working", fields: pickFields(tool.input) };
    case "output-available": {
      const parsed = resultSchema.safeParse(tool.output);
      if (parsed.success) return { kind: "result", result: parsed.data };
      return { kind: "error", message: UNREADABLE, emergency: false };
    }
    case "output-error": {
      const message =
        tool.errorText && tool.errorText.trim() !== "" ? tool.errorText : GENERIC_ERROR;
      return { kind: "error", message, emergency: /emergency/i.test(message) };
    }
    default:
      return { kind: "unsupported" };
  }
}
