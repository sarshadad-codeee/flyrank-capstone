import { EmergencyReportError } from "@/lib/tools/draftFeedback";

/** Shown for any failure that is not safe to explain. No provider details. */
export const STREAM_ERROR_TEXT = "Something went wrong. Please try again.";

/**
 * Chooses the text a user sees when the stream or a tool fails. The
 * emergency refusal is written for people, so it is passed through.
 * Every other error gets the generic message.
 */
export function describeStreamError(error: unknown): string {
  if (error instanceof EmergencyReportError) return error.message;
  if (error instanceof Error && error.name === "EmergencyReportError") {
    return error.message;
  }
  return STREAM_ERROR_TEXT;
}
