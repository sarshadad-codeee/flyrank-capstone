import { SERVICE_TYPES, type FeedbackFormValues, type FormErrors } from "../types/feedback";

export function validateFeedback(values: FeedbackFormValues): FormErrors {
  const errors: FormErrors = {};
  const phonePattern = /^[0-9+\-\s]{10,15}$/;

  if (!values.customerName.trim()) {
    errors.customerName = "Please enter your name.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Please enter a mobile number.";
  } else if (!phonePattern.test(values.phone.trim())) {
    errors.phone = "Enter a valid 10–15 digit mobile number.";
  }

  if (!values.serviceType || !(SERVICE_TYPES as readonly string[]).includes(values.serviceType)) {
    errors.serviceType = "Please select the service you used.";
  }

  if (values.rating < 1 || values.rating > 5) {
    errors.rating = "Please rate your visit from 1 to 5.";
  }

  if (!values.comments.trim()) {
    errors.comments = "Please share a short comment.";
  } else if (values.comments.trim().length < 8) {
    errors.comments = "Please write at least a few words.";
  }

  if (values.consumerNumber && !/^[A-Za-z0-9\-\/]{4,20}$/.test(values.consumerNumber.trim())) {
    errors.consumerNumber = "Consumer number looks invalid.";
  }

  return errors;
}
