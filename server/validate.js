import { COUNTERS, SERVICE_TYPES } from "../shared/constants.js";

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateFeedbackPayload(body) {
  if (!body || typeof body !== "object") {
    return "Invalid request body.";
  }

  if (!isNonEmptyString(body.customerName)) {
    return "Name is required.";
  }

  if (!isNonEmptyString(body.phone) || !/^[0-9+\-\s]{10,15}$/.test(body.phone.trim())) {
    return "A valid mobile number is required.";
  }

  if (!SERVICE_TYPES.includes(body.serviceType)) {
    return "A valid service type is required.";
  }

  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return "Rating must be a whole number from 1 to 5.";
  }

  if (!isNonEmptyString(body.comments) || body.comments.trim().length < 8) {
    return "Comments are required.";
  }

  if (body.consumerNumber && !/^[A-Za-z0-9\-\/]{4,20}$/.test(String(body.consumerNumber).trim())) {
    return "Consumer number looks invalid.";
  }

  if (body.counterId && !COUNTERS.includes(String(body.counterId))) {
    return "Counter must be between 1 and 5.";
  }

  return null;
}

export function normalizeFeedback(body) {
  return {
    consumerNumber: String(body.consumerNumber ?? "").trim(),
    customerName: body.customerName.trim(),
    phone: body.phone.trim(),
    serviceType: body.serviceType,
    counterId: String(body.counterId ?? "").trim(),
    rating: Number(body.rating),
    comments: body.comments.trim(),
  };
}
