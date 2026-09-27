interface FeedbackSuccessProps {
  onReset: () => void;
}

export function FeedbackSuccess({ onReset }: FeedbackSuccessProps) {
  return (
    <section className="card success" aria-live="polite">
      <h1>Thank you</h1>
      <p>Your feedback has been sent to the facilitation center incharge.</p>
      <p className="muted">You can close this page, or submit another response if someone else used this phone.</p>
      <button type="button" className="secondary" onClick={onReset}>
        Submit another response
      </button>
    </section>
  );
}
