// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

function Harness() {
  return (
    <Dialog>
      <DialogTrigger>Open it</DialogTrigger>
      <DialogContent>
        <DialogTitle>Confirm</DialogTitle>
        <DialogDescription>Some detail</DialogDescription>
        <label htmlFor="n">Name</label>
        <input id="n" type="text" />
      </DialogContent>
    </Dialog>
  );
}

async function openIt() {
  const user = userEvent.setup();
  render(<Harness />);
  await user.tab();
  await user.keyboard("{Enter}");
  const dialog = await screen.findByRole("dialog");
  return { user, dialog };
}

describe("shadcn Dialog", () => {
  it("opens with a title label and a description", async () => {
    const { dialog } = await openIt();
    expect(dialog).toHaveAccessibleName("Confirm");
    expect(dialog).toHaveAccessibleDescription("Some detail");
  });

  it("moves focus inside when opened", async () => {
    const { dialog } = await openIt();
    await waitFor(() =>
      expect(dialog).toContainElement(document.activeElement as HTMLElement)
    );
  });

  it("brings focus back inside after tabbing past the last control", async () => {
    const { user, dialog } = await openIt();
    for (let i = 0; i < 4; i++) {
      await user.tab();
      await waitFor(() =>
        expect(dialog).toContainElement(document.activeElement as HTMLElement)
      );
    }
  });

  it("closes with Escape and returns focus to the trigger", async () => {
    const { user } = await openIt();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Open it" })).toHaveFocus()
    );
  });
});
