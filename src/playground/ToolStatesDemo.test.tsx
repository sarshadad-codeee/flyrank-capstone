// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ToolStatesDemo } from "./ToolStatesDemo";

describe("ToolStatesDemo", () => {
  it("shows every tool state from sample data", () => {
    const { container } = render(<ToolStatesDemo />);
    for (const state of ["drafting", "working", "result", "error"]) {
      expect(container.querySelector('[data-state="' + state + '"]')).not.toBeNull();
    }
  });

  it("shows both kinds of error card", () => {
    const { container } = render(<ToolStatesDemo />);
    expect(container.querySelectorAll('[data-state="error"]')).toHaveLength(2);
    expect(container.textContent).toContain("This cannot be filed as feedback");
    expect(container.textContent).toContain("The draft could not be created");
  });

  it("says plainly that the cards use sample data", () => {
    const { container } = render(<ToolStatesDemo />);
    expect(container.textContent).toContain("fixed sample data");
  });

  it("asks a different question in each heading", () => {
    const { container } = render(<ToolStatesDemo />);
    const text = container.textContent ?? "";
    expect(text).toContain("What is it doing?");
    expect(text).toContain("With what input?");
    expect(text).toContain("What came back?");
    expect(text).toContain("What went wrong?");
  });
});
