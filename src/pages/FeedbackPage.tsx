import { FeedbackForm } from "../components/FeedbackForm";
import { parseCounterParam } from "../lib/validateFeedback";

export function FeedbackPage() {
  const counter = parseCounterParam(
    new URLSearchParams(window.location.search).get("counter"),
  );

  return (
    <main>
      <FeedbackForm initialCounter={counter} />
    </main>
  );
}
