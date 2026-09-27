import { FormEvent, useMemo, useState } from "react";
import { COUNTERS } from "../../shared/constants.js";
import { submitFeedback } from "../lib/submitFeedback";
import { validateFeedback } from "../lib/validateFeedback";
import { SERVICE_TYPES, type FeedbackFormValues, type FormErrors, type ServiceType } from "../types/feedback";
import { describedBy, Field } from "./Field";
import { FeedbackSuccess } from "./FeedbackSuccess";
import { RatingInput } from "./RatingInput";

const EMPTY_FORM: FeedbackFormValues = {
  consumerNumber: "",
  customerName: "",
  phone: "",
  serviceType: "",
  counterId: "",
  rating: 0,
  comments: "",
};

function counterFromUrl() {
  const value = new URLSearchParams(window.location.search).get("counter") ?? "";
  return COUNTERS.includes(value) ? value : "";
}

export function FeedbackForm() {
  const presetCounter = useMemo(counterFromUrl, []);
  const [values, setValues] = useState<FeedbackFormValues>({
    ...EMPTY_FORM,
    counterId: presetCounter,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof FeedbackFormValues>(key: K, value: FeedbackFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitError("");

    const nextErrors = validateFeedback(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      await submitFeedback({
        consumerNumber: values.consumerNumber.trim(),
        customerName: values.customerName.trim(),
        phone: values.phone.trim(),
        serviceType: values.serviceType as ServiceType,
        counterId: values.counterId,
        rating: values.rating,
        comments: values.comments.trim(),
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setValues({ ...EMPTY_FORM, counterId: presetCounter });
    setErrors({});
    setSubmitError("");
    setSubmitted(false);
  }

  if (submitted) {
    return <FeedbackSuccess onReset={handleReset} />;
  }

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <Field id="customerName" label="Your name" error={errors.customerName}>
        <input
          id="customerName"
          name="customerName"
          autoComplete="name"
          value={values.customerName}
          onChange={(event) => update("customerName", event.target.value)}
          aria-invalid={Boolean(errors.customerName)}
          aria-describedby={describedBy("customerName", errors, "customerName")}
        />
      </Field>

      <Field id="phone" label="Mobile number" error={errors.phone}>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={(event) => update("phone", event.target.value)}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={describedBy("phone", errors, "phone")}
        />
      </Field>

      <Field
        id="consumerNumber"
        label="Consumer / account number (optional)"
        hint="Helps staff match your visit if you know it."
        error={errors.consumerNumber}
      >
        <input
          id="consumerNumber"
          name="consumerNumber"
          value={values.consumerNumber}
          onChange={(event) => update("consumerNumber", event.target.value)}
          aria-invalid={Boolean(errors.consumerNumber)}
          aria-describedby={describedBy("consumerNumber", errors, "consumerNumber", true)}
        />
      </Field>

      <Field id="serviceType" label="Service at the counter" error={errors.serviceType}>
        <select
          id="serviceType"
          name="serviceType"
          value={values.serviceType}
          onChange={(event) => update("serviceType", event.target.value as FeedbackFormValues["serviceType"])}
          aria-invalid={Boolean(errors.serviceType)}
          aria-describedby={describedBy("serviceType", errors, "serviceType")}
        >
          <option value="">Select a service</option>
          {SERVICE_TYPES.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </Field>

      <Field
        id="counterId"
        label="Counter number"
        hint="Leave blank if you are not sure. A QR code can also set this automatically."
      >
        <select
          id="counterId"
          name="counterId"
          value={values.counterId}
          onChange={(event) => update("counterId", event.target.value)}
        >
          <option value="">Not sure</option>
          {COUNTERS.map((counter) => (
            <option key={counter} value={counter}>
              Counter {counter}
            </option>
          ))}
        </select>
      </Field>

      <RatingInput value={values.rating} onChange={(rating) => update("rating", rating)} error={errors.rating} />

      <Field id="comments" label="Your comments" error={errors.comments}>
        <textarea
          id="comments"
          name="comments"
          rows={4}
          value={values.comments}
          onChange={(event) => update("comments", event.target.value)}
          aria-invalid={Boolean(errors.comments)}
          aria-describedby={describedBy("comments", errors, "comments")}
          placeholder="What went well, or what should improve?"
        />
      </Field>

      {submitError ? (
        <p className="error banner" role="alert">
          {submitError}
        </p>
      ) : null}

      <button type="submit" className="primary" disabled={submitting}>
        {submitting ? "Sending…" : "Send feedback"}
      </button>
    </form>
  );
}
