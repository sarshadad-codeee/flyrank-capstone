import type { FeedbackPayload } from "../types/feedback";

export async function submitFeedback(payload: FeedbackPayload): Promise<void> {
  const response = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => null)) as { error?: string } | null;

  if (!response.ok) {
    throw new Error(data?.error ?? "Could not send your feedback. Please try again.");
  }
}
