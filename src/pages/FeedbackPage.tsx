import { FeedbackForm } from "../components/FeedbackForm";

export function FeedbackPage() {
  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">Gas Utility Facilitation Center</p>
        <h1>Customer feedback</h1>
        <p>
          Scan complete. Tell us about the service you just received. Your comments go
          directly to the center incharge.
        </p>
      </header>
      <FeedbackForm />
    </main>
  );
}
