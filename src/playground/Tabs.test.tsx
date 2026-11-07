// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs } from "./Tabs";
import type { TabItem } from "./Tabs";

const items: TabItem[] = [
  { id: "one", label: "One", content: "First panel" },
  { id: "two", label: "Two", content: "Second panel" },
  { id: "three", label: "Three", content: "Third panel" },
];

function setup() {
  const user = userEvent.setup();
  render(<Tabs tabs={items} label="Example tabs" />);
  return user;
}

describe("Tabs", () => {
  it("selects the first tab and shows only its panel", () => {
    setup();

    expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByText("First panel")).toBeVisible();
    expect(screen.getByText("Second panel")).not.toBeVisible();
  });

  it("puts only the selected tab in the Tab order", () => {
    setup();

    expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute(
      "tabindex",
      "0"
    );
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute(
      "tabindex",
      "-1"
    );
    expect(screen.getByRole("tab", { name: "Three" })).toHaveAttribute(
      "tabindex",
      "-1"
    );
  });

  it("moves focus and selection with ArrowRight and wraps at the end", async () => {
    const user = setup();
    await user.tab();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveFocus();
    expect(screen.getByText("Second panel")).toBeVisible();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Three" })).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "One" })).toHaveFocus();
    expect(screen.getByText("First panel")).toBeVisible();
  });

  it("moves with ArrowLeft and wraps at the start", async () => {
    const user = setup();
    await user.tab();

    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "Three" })).toHaveFocus();
    expect(screen.getByText("Third panel")).toBeVisible();
  });

  it("jumps to the last tab with End and the first with Home", async () => {
    const user = setup();
    await user.tab();

    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Three" })).toHaveFocus();

    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "One" })).toHaveFocus();
  });

  it("moves focus from the selected tab into its panel with Tab", async () => {
    const user = setup();
    await user.tab();
    await user.tab();

    expect(screen.getByRole("tabpanel")).toHaveFocus();
  });

  it("links each tab to its panel with aria-controls and aria-labelledby", () => {
    setup();

    const tab = screen.getByRole("tab", { name: "One" });
    const panel = screen.getByRole("tabpanel");

    expect(tab.getAttribute("aria-controls")).toBe(panel.id);
    expect(panel.getAttribute("aria-labelledby")).toBe(tab.id);
  });
});
