interface RatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  error?: string;
}

const LABELS = ["Very poor", "Poor", "Okay", "Good", "Excellent"];

export function RatingInput({ value, onChange, error }: RatingInputProps) {
  return (
    <fieldset className="rating" aria-invalid={error ? true : undefined} aria-describedby={error ? "rating-error" : undefined}>
      <legend>How was your visit?</legend>
      <div className="rating-options">
        {LABELS.map((label, index) => {
          const rating = index + 1;
          const selected = value === rating;
          return (
            <button
              key={rating}
              type="button"
              className={selected ? "rating-btn selected" : "rating-btn"}
              aria-pressed={selected}
              onClick={() => onChange(rating)}
            >
              <span className="rating-num">{rating}</span>
              <span className="rating-label">{label}</span>
            </button>
          );
        })}
      </div>
      {error ? (
        <p id="rating-error" className="error" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
