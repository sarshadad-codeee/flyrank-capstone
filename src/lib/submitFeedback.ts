import type { FeedbackPayload } from "../types/feedback";

export async function submitFeedback(payload: FeedbackPayload): Promise<void> {
  const response = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Could not send feedback. Try again.");
  }
}
