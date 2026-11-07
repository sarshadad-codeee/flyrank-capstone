// @vitest-environment jsdom
import { useState } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";

function Harness() {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        Open modal
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Confirm">
        <label htmlFor="name">Name</label>
        <input id="name" type="text" />
      </Modal>
    </div>
  );
}

async function openModal() {
  const user = userEvent.setup();
  render(<Harness />);
  await user.tab();
  await user.keyboard("{Enter}");
  return user;
}

describe("Modal", () => {
  it("renders nothing while closed", () => {
    render(<Harness />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens with dialog semantics and a label from its title", async () => {
    await openModal();

    const dialog = screen.getByRole("dialog", { name: "Confirm" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("moves focus to the first control inside when it opens", async () => {
    await openModal();

    expect(screen.getByLabelText("Name")).toHaveFocus();
  });

  it("traps focus: Tab wraps from the last control to the first", async () => {
    const user = await openModal();

    await user.tab();
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText("Name")).toHaveFocus();
  });

  it("traps focus: Shift+Tab wraps from the first control to the last", async () => {
    const user = await openModal();

    await user.tab({ shift: true });
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
  });

  it("closes with Escape and returns focus to the opener", async () => {
    const user = await openModal();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole("button", { name: "Open modal" })).toHaveFocus();
  });

  it("closes with the Close button and returns focus to the opener", async () => {
    const user = await openModal();

    await user.tab();
    await user.keyboard("{Enter}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole("button", { name: "Open modal" })).toHaveFocus();
  });

  it("makes the rest of the page inert while open and restores it on close", async () => {
    const user = await openModal();

    const root = screen.getByRole("button", {
      name: "Open modal",
      hidden: true,
    }).parentElement?.parentElement;
    expect(root).not.toBeNull();
    expect((root as HTMLElement).inert).toBe(true);

    await user.keyboard("{Escape}");
    expect((root as HTMLElement).inert).toBe(false);
  });
});
