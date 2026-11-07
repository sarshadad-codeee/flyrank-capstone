// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Disclosure } from "./Disclosure";

describe("Disclosure", () => {
  it("starts collapsed and the button is reachable with Tab", async () => {
    const user = userEvent.setup();
    render(<Disclosure title="Details">Hidden text</Disclosure>);

    const button = screen.getByRole("button", { name: /details/i });
    expect(button).toHaveAttribute("aria-expanded", "false");

    await user.tab();
    expect(button).toHaveFocus();
  });

  it("toggles with Enter and with Space", async () => {
    const user = userEvent.setup();
    render(<Disclosure title="Details">Hidden text</Disclosure>);

    const button = screen.getByRole("button", { name: /details/i });
    await user.tab();

    await user.keyboard("{Enter}");
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Hidden text")).toBeVisible();

    await user.keyboard(" ");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Hidden text")).not.toBeVisible();
  });

  it("points aria-controls at the panel it shows and hides", () => {
    render(<Disclosure title="Details">Hidden text</Disclosure>);

    const button = screen.getByRole("button", { name: /details/i });
    const panelId = button.getAttribute("aria-controls");
    expect(panelId).toBeTruthy();

    const panel = document.getElementById(panelId as string);
    expect(panel).not.toBeNull();
    expect(panel).toHaveTextContent("Hidden text");
  });

  it("honours defaultExpanded", () => {
    render(
      <Disclosure title="Details" defaultExpanded>
        Shown text
      </Disclosure>
    );

    expect(screen.getByRole("button", { name: /details/i })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(screen.getByText("Shown text")).toBeVisible();
  });
});
