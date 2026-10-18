import { describe, expect, it } from "vitest";
import type { FeedbackFormValues } from "../types/feedback";
import { ERRORS, validateFeedback } from "./validateFeedback";

function validValues(
  overrides: Partial<FeedbackFormValues> = {},
): FeedbackFormValues {
  return {
    customerName: "Ayesha Khan",
    mobileNumber: "03001234567",
    consumerNumber: "",
    serviceType: "duplicate_bill",
    counter: "",
    rating: 4,
    comments: "Staff explained the bill clearly.",
    ...overrides,
  };
}

describe("validateFeedback", () => {
  it("shows all required field errors on empty submit", () => {
    const errors = validateFeedback({
      customerName: "",
      mobileNumber: "",
      consumerNumber: "",
      serviceType: "",
      counter: "",
      rating: null,
      comments: "",
    });

    expect(errors).toEqual({
      customerName: ERRORS.nameRequired,
      mobileNumber: ERRORS.mobileRequired,
      serviceType: ERRORS.serviceRequired,
      rating: ERRORS.ratingRequired,
      comments: ERRORS.commentsRequired,
    });
    expect(errors.consumerNumber).toBeUndefined();
    expect(errors.counter).toBeUndefined();
  });

  it("rejects an invalid mobile number format", () => {
    const errors = validateFeedback(validValues({ mobileNumber: "12345" }));
    expect(errors.mobileNumber).toBe(ERRORS.mobileFormat);
  });

  it("rejects an implausible mobile number with repeated digits", () => {
    const errors = validateFeedback(validValues({ mobileNumber: "0000000000" }));
    expect(errors.mobileNumber).toBe(ERRORS.mobileImplausible);
  });

  it("accepts a valid submission", () => {
    const errors = validateFeedback(
      validValues({
        consumerNumber: "GAS-12/345",
        counter: "2",
      }),
    );
    expect(errors).toEqual({});
  });

  it("allows optional consumer number and counter to be blank", () => {
    const errors = validateFeedback(
      validValues({
        consumerNumber: "",
        counter: "",
      }),
    );
    expect(errors.consumerNumber).toBeUndefined();
    expect(errors.counter).toBeUndefined();
    expect(errors).toEqual({});
  });
});
