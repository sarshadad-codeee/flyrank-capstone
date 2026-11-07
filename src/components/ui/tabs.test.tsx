// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

function Harness() {
  return (
    <Tabs defaultValue="one">
      <TabsList>
        <TabsTrigger value="one">One</TabsTrigger>
        <TabsTrigger value="two">Two</TabsTrigger>
        <TabsTrigger value="three">Three</TabsTrigger>
      </TabsList>
      <TabsContent value="one">First</TabsContent>
      <TabsContent value="two">Second</TabsContent>
      <TabsContent value="three">Third</TabsContent>
    </Tabs>
  );
}

describe("shadcn Tabs", () => {
  it("selects the first tab", () => {
    render(<Harness />);
    expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("moves focus with ArrowRight without selecting (manual activation)", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.tab();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });

  it("wraps from the last tab to the first with ArrowRight", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.tab();
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Three" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "One" })).toHaveFocus();
  });
});
