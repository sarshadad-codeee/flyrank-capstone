import {
  SERVICE_TYPE_VALUES,
  type FeedbackFormValues,
  type FeedbackPayload,
  type FieldErrors,
  type ServiceType,
} from "../types/feedback";

export const ERRORS = {
  nameRequired: "Customer name is required.",
  mobileRequired: "Mobile number is required.",
  mobileFormat: "Enter a valid mobile number (10 to 13 digits).",
  mobileImplausible: "This mobile number looks implausible. Enter a real number.",
  consumerFormat:
    "Consumer number must be 4 to 20 characters (letters, numbers, hyphens, or slashes).",
  serviceRequired: "Select a service type.",
  counterRange: "Counter must be a number from 1 to 5.",
  ratingRequired: "Select a rating from 1 to 5.",
  commentsRequired: "Comments are required.",
  commentsMin: "Comments must be at least 8 characters.",
} as const;

const MOBILE_FORMAT = /^\+?[\d\s-]{10,16}$/;
const CONSUMER_FORMAT = /^[A-Za-z0-9/-]{4,20}$/;

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function isRepeatedDigitNumber(digits: string): boolean {
  return digits.length > 0 && /^(\d)\1+$/.test(digits);
}

export function parseCounterParam(raw: string | null | undefined): string {
  if (!raw) {
    return "";
  }
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > 5) {
    return "";
  }
  return String(n);
}

function validateMobile(mobileRaw: string): string | undefined {
  if (!mobileRaw) {
    return ERRORS.mobileRequired;
  }

  const digits = digitsOnly(mobileRaw);
  const formatOk =
    MOBILE_FORMAT.test(mobileRaw) && digits.length >= 10 && digits.length <= 13;

  if (!formatOk) {
    return ERRORS.mobileFormat;
  }

  if (isRepeatedDigitNumber(digits)) {
    return ERRORS.mobileImplausible;
  }

  return undefined;
}

export function validateFeedback(input: FeedbackFormValues): FieldErrors {
  const errors: FieldErrors = {};
  const customerName = input.customerName.trim();
  const mobileNumber = input.mobileNumber.trim();
  const consumerNumber = input.consumerNumber.trim();
  const comments = input.comments.trim();
  const counter = input.counter.trim();

  if (!customerName) {
    errors.customerName = ERRORS.nameRequired;
  }

  const mobileError = validateMobile(mobileNumber);
  if (mobileError) {
    errors.mobileNumber = mobileError;
  }

  if (consumerNumber && !CONSUMER_FORMAT.test(consumerNumber)) {
    errors.consumerNumber = ERRORS.consumerFormat;
  }

  if (!input.serviceType) {
    errors.serviceType = ERRORS.serviceRequired;
  } else if (!SERVICE_TYPE_VALUES.includes(input.serviceType as ServiceType)) {
    errors.serviceType = ERRORS.serviceRequired;
  }

  if (counter) {
    const n = Number(counter);
    if (!Number.isInteger(n) || n < 1 || n > 5) {
      errors.counter = ERRORS.counterRange;
    }
  }

  if (input.rating === null || input.rating === undefined) {
    errors.rating = ERRORS.ratingRequired;
  } else if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    errors.rating = ERRORS.ratingRequired;
  }

  if (!comments) {
    errors.comments = ERRORS.commentsRequired;
  } else if (comments.length < 8) {
    errors.comments = ERRORS.commentsMin;
  }

  return errors;
}

export function toFeedbackPayload(input: FeedbackFormValues): FeedbackPayload {
  const consumerNumber = input.consumerNumber.trim();
  const counter = input.counter.trim();

  return {
    customerName: input.customerName.trim(),
    mobileNumber: digitsOnly(input.mobileNumber.trim()),
    ...(consumerNumber ? { consumerNumber } : {}),
    serviceType: input.serviceType as ServiceType,
    ...(counter ? { counter: Number(counter) } : {}),
    rating: input.rating as number,
    comments: input.comments.trim(),
  };
}
