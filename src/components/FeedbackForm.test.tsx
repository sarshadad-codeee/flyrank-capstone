import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ERRORS } from "../lib/validateFeedback";
import { FeedbackForm } from "./FeedbackForm";

async function fillRequiredFields(
  user: ReturnType<typeof userEvent.setup>,
  options?: { mobile?: string; includeOptional?: boolean },
) {
  await user.type(screen.getByLabelText("Customer name"), "Ayesha Khan");
  await user.type(
    screen.getByLabelText("Mobile number"),
    options?.mobile ?? "03001234567",
  );
  await user.selectOptions(screen.getByLabelText("Service type"), "duplicate_bill");
  await user.click(screen.getByRole("button", { name: "4" }));
  await user.type(
    screen.getByLabelText("Comments"),
    "Staff explained the bill clearly.",
  );

  if (options?.includeOptional) {
    await user.type(screen.getByLabelText(/Consumer\/account number/), "GAS-12/345");
    await user.type(screen.getByLabelText(/Counter number/), "2");
  }
}

describe("FeedbackForm", () => {
  it("shows all required field errors on empty submit", async () => {
    const user = userEvent.setup();
    render(<FeedbackForm onSubmitFeedback={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Submit feedback" }));

    expect(screen.getByText(ERRORS.nameRequired)).toBeInTheDocument();
    expect(screen.getByText(ERRORS.mobileRequired)).toBeInTheDocument();
    expect(screen.getByText(ERRORS.serviceRequired)).toBeInTheDocument();
    expect(screen.getByText(ERRORS.ratingRequired)).toBeInTheDocument();
    expect(screen.getByText(ERRORS.commentsRequired)).toBeInTheDocument();
    expect(screen.queryByText(ERRORS.consumerFormat)).not.toBeInTheDocument();
    expect(screen.queryByText(ERRORS.counterRange)).not.toBeInTheDocument();
  });

  it("rejects an invalid mobile number format", async () => {
    const user = userEvent.setup();
    const onSubmitFeedback = vi.fn();
    render(<FeedbackForm onSubmitFeedback={onSubmitFeedback} />);

    await fillRequiredFields(user, { mobile: "12345" });
    await user.click(screen.getByRole("button", { name: "Submit feedback" }));

    expect(screen.getByText(ERRORS.mobileFormat)).toBeInTheDocument();
    expect(onSubmitFeedback).not.toHaveBeenCalled();
  });

  it("rejects an implausible mobile number with repeated digits", async () => {
    const user = userEvent.setup();
    const onSubmitFeedback = vi.fn();
    render(<FeedbackForm onSubmitFeedback={onSubmitFeedback} />);

    await fillRequiredFields(user, { mobile: "1111111111" });
    await user.click(screen.getByRole("button", { name: "Submit feedback" }));

    expect(screen.getByText(ERRORS.mobileImplausible)).toBeInTheDocument();
    expect(onSubmitFeedback).not.toHaveBeenCalled();
  });

  it("submits a valid form", async () => {
    const user = userEvent.setup();
    const onSubmitFeedback = vi.fn().mockResolvedValue(undefined);
    render(<FeedbackForm onSubmitFeedback={onSubmitFeedback} />);

    await fillRequiredFields(user, { includeOptional: true });
    await user.click(screen.getByRole("button", { name: "Submit feedback" }));

    expect(onSubmitFeedback).toHaveBeenCalledWith({
      customerName: "Ayesha Khan",
      mobileNumber: "03001234567",
      consumerNumber: "GAS-12/345",
      serviceType: "duplicate_bill",
      counter: 2,
      rating: 4,
      comments: "Staff explained the bill clearly.",
    });
    expect(await screen.findByText("Feedback sent")).toBeInTheDocument();
  });

  it("allows optional consumer number and counter to be blank", async () => {
    const user = userEvent.setup();
    const onSubmitFeedback = vi.fn().mockResolvedValue(undefined);
    render(<FeedbackForm onSubmitFeedback={onSubmitFeedback} />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: "Submit feedback" }));

    expect(onSubmitFeedback).toHaveBeenCalledWith({
      customerName: "Ayesha Khan",
      mobileNumber: "03001234567",
      serviceType: "duplicate_bill",
      rating: 4,
      comments: "Staff explained the bill clearly.",
    });
    expect(await screen.findByText("Feedback sent")).toBeInTheDocument();
  });
});
