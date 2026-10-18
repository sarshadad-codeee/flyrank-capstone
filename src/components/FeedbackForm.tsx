import { useId, useState, type FormEvent } from "react";
import { submitFeedback } from "../lib/submitFeedback";
import {
  parseCounterParam,
  toFeedbackPayload,
  validateFeedback,
} from "../lib/validateFeedback";
import type { FeedbackFormValues, FieldErrors } from "../types/feedback";

const SERVICE_OPTIONS = [
  { value: "installment", label: "Installment" },
  { value: "duplicate_bill", label: "Duplicate bill" },
  { value: "name_address_correction", label: "Name/address correction" },
  { value: "bank_query", label: "Bank query" },
  { value: "high_billing", label: "High billing" },
  { value: "other", label: "Other" },
] as const;

const emptyValues: FeedbackFormValues = {
  customerName: "",
  mobileNumber: "",
  consumerNumber: "",
  serviceType: "",
  counter: "",
  rating: null,
  comments: "",
};

interface FeedbackFormProps {
  initialCounter?: string;
  onSubmitFeedback?: typeof submitFeedback;
}

export function FeedbackForm({
  initialCounter = "",
  onSubmitFeedback = submitFeedback,
}: FeedbackFormProps) {
  const formId = useId();
  const [values, setValues] = useState<FeedbackFormValues>({
    ...emptyValues,
    counter: parseCounterParam(initialCounter),
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [submitError, setSubmitError] = useState("");

  function fieldId(name: string): string {
    return `${formId}-${name}`;
  }

  function errorId(name: string): string {
    return `${formId}-${name}-error`;
  }

  function describedBy(name: keyof FieldErrors): string | undefined {
    return errors[name] ? errorId(name) : undefined;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const nextErrors = validateFeedback(values);
    setErrors(nextErrors);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      return;
    }

    setStatus("submitting");
    try {
      await onSubmitFeedback(toFeedbackPayload(values));
      setStatus("success");
      setValues({
        ...emptyValues,
        counter: parseCounterParam(initialCounter),
      });
    } catch {
      setStatus("error");
      setSubmitError("Could not send feedback. Try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="panel" role="status">
        <h1>Feedback sent</h1>
        <p>Thank you. Your feedback was sent to the facilitation center incharge.</p>
        <button type="button" className="primary" onClick={() => setStatus("idle")}>
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <form className="panel" onSubmit={handleSubmit} noValidate>
      <h1>Customer feedback</h1>
      <p className="lede">
        Tell us about the service you received at the Customer Facilitation Center.
      </p>

      <div className="field">
        <label htmlFor={fieldId("customerName")}>Customer name</label>
        <input
          id={fieldId("customerName")}
          name="customerName"
          type="text"
          autoComplete="name"
          value={values.customerName}
          onChange={(event) =>
            setValues((current) => ({ ...current, customerName: event.target.value }))
          }
          aria-invalid={Boolean(errors.customerName)}
          aria-describedby={describedBy("customerName")}
          required
        />
        {errors.customerName ? (
          <p id={errorId("customerName")} className="error" role="alert">
            {errors.customerName}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor={fieldId("mobileNumber")}>Mobile number</label>
        <input
          id={fieldId("mobileNumber")}
          name="mobileNumber"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          value={values.mobileNumber}
          onChange={(event) =>
            setValues((current) => ({ ...current, mobileNumber: event.target.value }))
          }
          aria-invalid={Boolean(errors.mobileNumber)}
          aria-describedby={describedBy("mobileNumber")}
          required
        />
        {errors.mobileNumber ? (
          <p id={errorId("mobileNumber")} className="error" role="alert">
            {errors.mobileNumber}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor={fieldId("consumerNumber")}>Consumer/account number (optional)</label>
        <input
          id={fieldId("consumerNumber")}
          name="consumerNumber"
          type="text"
          value={values.consumerNumber}
          onChange={(event) =>
            setValues((current) => ({ ...current, consumerNumber: event.target.value }))
          }
          aria-invalid={Boolean(errors.consumerNumber)}
          aria-describedby={describedBy("consumerNumber")}
        />
        {errors.consumerNumber ? (
          <p id={errorId("consumerNumber")} className="error" role="alert">
            {errors.consumerNumber}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor={fieldId("serviceType")}>Service type</label>
        <select
          id={fieldId("serviceType")}
          name="serviceType"
          value={values.serviceType}
          onChange={(event) =>
            setValues((current) => ({ ...current, serviceType: event.target.value }))
          }
          aria-invalid={Boolean(errors.serviceType)}
          aria-describedby={describedBy("serviceType")}
          required
        >
          <option value="">Select a service</option>
          {SERVICE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.serviceType ? (
          <p id={errorId("serviceType")} className="error" role="alert">
            {errors.serviceType}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor={fieldId("counter")}>Counter number (optional)</label>
        <input
          id={fieldId("counter")}
          name="counter"
          type="number"
          min={1}
          max={5}
          value={values.counter}
          onChange={(event) =>
            setValues((current) => ({ ...current, counter: event.target.value }))
          }
          aria-invalid={Boolean(errors.counter)}
          aria-describedby={describedBy("counter")}
        />
        {errors.counter ? (
          <p id={errorId("counter")} className="error" role="alert">
            {errors.counter}
          </p>
        ) : null}
      </div>

      <fieldset
        className="field rating"
        aria-invalid={Boolean(errors.rating)}
        aria-describedby={describedBy("rating")}
      >
        <legend>Rating</legend>
        <div className="rating-buttons">
          {[1, 2, 3, 4, 5].map((score) => (
            <button
              key={score}
              type="button"
              className="rating-button"
              aria-pressed={values.rating === score}
              onClick={() => setValues((current) => ({ ...current, rating: score }))}
            >
              {score}
            </button>
          ))}
        </div>
        {errors.rating ? (
          <p id={errorId("rating")} className="error" role="alert">
            {errors.rating}
          </p>
        ) : null}
      </fieldset>

      <div className="field">
        <label htmlFor={fieldId("comments")}>Comments</label>
        <textarea
          id={fieldId("comments")}
          name="comments"
          rows={4}
          value={values.comments}
          onChange={(event) =>
            setValues((current) => ({ ...current, comments: event.target.value }))
          }
          aria-invalid={Boolean(errors.comments)}
          aria-describedby={describedBy("comments")}
          required
        />
        {errors.comments ? (
          <p id={errorId("comments")} className="error" role="alert">
            {errors.comments}
          </p>
        ) : null}
      </div>

      {submitError ? (
        <p className="error" role="alert">
          {submitError}
        </p>
      ) : null}

      <button type="submit" className="primary" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending..." : "Submit feedback"}
      </button>
    </form>
  );
}
