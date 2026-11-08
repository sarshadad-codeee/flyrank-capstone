// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToolCard } from "./ToolCard";

describe("ToolCard", () => {
  it("shows a drafting state with a status role and a skeleton", () => {
    render(<ToolCard view={{ kind: "drafting", fields: {} }} />);
    expect(screen.getByRole("status")).toHaveAttribute("data-state", "drafting");
    expect(screen.getByText("Drafting your feedback summary")).toBeInTheDocument();
  });

  it("shows the fields that have arrived while drafting", () => {
    render(
      <ToolCard view={{ kind: "drafting", fields: { category: "high_billing", summary: "Bill doubled." } }} />
    );
    expect(screen.getByText("High billing")).toBeInTheDocument();
    expect(screen.getByText("Bill doubled.")).toBeInTheDocument();
  });

  it("shows the working state with labelled rows", () => {
    render(
      <ToolCard view={{ kind: "working", fields: { summary: "Bill doubled.", urgency: "normal" } }} />
    );
    expect(screen.getByRole("status")).toHaveAttribute("data-state", "working");
    expect(screen.getByText("Saving the draft")).toBeInTheDocument();
    expect(screen.getByText("Summary")).toBeInTheDocument();
  });

  it("shows the result as a labelled group with text badges", () => {
    render(
      <ToolCard
        view={{
          kind: "result",
          result: {
            category: "high_billing",
            categoryLabel: "High billing",
            urgency: "high",
            summary: "My bill doubled.",
            details: "Since October.",
            desiredOutcome: "Check my meter.",
          },
        }}
      />
    );
    expect(screen.getByRole("group", { name: "Feedback summary" })).toHaveAttribute("data-state", "result");
    expect(screen.getByText("High billing")).toBeInTheDocument();
    expect(screen.getByText("High urgency")).toBeInTheDocument();
    expect(screen.getByText("Since October.")).toBeInTheDocument();
    expect(screen.getByText("Check my meter.")).toBeInTheDocument();
  });

  it("leaves out optional rows that are missing", () => {
    render(
      <ToolCard
        view={{
          kind: "result",
          result: { category: "other", categoryLabel: "Other", urgency: "low", summary: "A short issue." },
        }}
      />
    );
    expect(screen.queryByText("Details")).toBeNull();
    expect(screen.queryByText("Desired outcome")).toBeNull();
  });

  it("shows an emergency error as an alert with its own title", () => {
    render(
      <ToolCard view={{ kind: "error", message: "This sounds like an emergency.", emergency: true }} />
    );
    expect(screen.getByRole("alert")).toHaveAttribute("data-state", "error");
    expect(screen.getByText("This cannot be filed as feedback")).toBeInTheDocument();
    expect(screen.getByText("This sounds like an emergency.")).toBeInTheDocument();
  });

  it("shows an ordinary error with a next step", () => {
    render(<ToolCard view={{ kind: "error", message: "Something broke.", emergency: false }} />);
    expect(screen.getByText("The draft could not be created")).toBeInTheDocument();
    expect(screen.getByText(/try once more/i)).toBeInTheDocument();
  });

  it("renders nothing for an unsupported state", () => {
    const { container } = render(<ToolCard view={{ kind: "unsupported" }} />);
    expect(container).toBeEmptyDOMElement();
  });
});
