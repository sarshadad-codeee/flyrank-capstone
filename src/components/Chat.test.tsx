// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

interface TestMessage {
  id: string;
  role: string;
  parts: Array<{ type: string; text?: string }>;
}

const chat = vi.hoisted(() => ({
  messages: [] as TestMessage[],
  status: "ready" as string,
  error: undefined as Error | undefined,
  sendMessage: vi.fn(),
  stop: vi.fn(),
}));

vi.mock("@ai-sdk/react", () => ({ useChat: () => chat }));

import { Chat } from "./Chat";

beforeEach(() => {
  chat.messages = [];
  chat.status = "ready";
  chat.error = undefined;
  chat.sendMessage.mockReset();
  chat.stop.mockReset();
});

describe("Chat", () => {
  it("sends the trimmed text and clears the input", async () => {
    const user = userEvent.setup();
    render(<Chat />);
    await user.type(screen.getByLabelText("Your message"), "  gas bill  ");
    await user.click(screen.getByRole("button", { name: "Send" }));
    expect(chat.sendMessage).toHaveBeenCalledWith({ text: "gas bill" });
    expect(screen.getByLabelText("Your message")).toHaveValue("");
  });

  it("sends with Enter and keeps a newline for Shift+Enter", async () => {
    const user = userEvent.setup();
    render(<Chat />);
    const box = screen.getByLabelText("Your message");
    await user.type(box, "a{Shift>}{Enter}{/Shift}b");
    expect(chat.sendMessage).not.toHaveBeenCalled();
    await user.type(box, "{Enter}");
    expect(chat.sendMessage).toHaveBeenCalledTimes(1);
  });

  it("does not send an empty message and disables Send", () => {
    render(<Chat />);
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });

  it("shows the thinking indicator right after sending", () => {
    chat.status = "submitted";
    chat.messages = [{ id: "u1", role: "user", parts: [{ type: "text", text: "Hi" }] }];
    render(<Chat />);
    expect(screen.getByRole("status")).toHaveTextContent("thinking");
  });

  it("swaps the indicator for streamed text without showing both", () => {
    chat.status = "streaming";
    chat.messages = [
      { id: "u1", role: "user", parts: [{ type: "text", text: "Hi" }] },
      { id: "a1", role: "assistant", parts: [{ type: "text", text: "Hello" }] },
    ];
    render(<Chat />);
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("shows Stop while streaming and calls stop", async () => {
    const user = userEvent.setup();
    chat.status = "streaming";
    chat.messages = [
      { id: "a1", role: "assistant", parts: [{ type: "text", text: "Part" }] },
    ];
    render(<Chat />);
    expect(screen.queryByRole("button", { name: "Send" })).toBeNull();
    await user.click(screen.getByRole("button", { name: "Stop" }));
    expect(chat.stop).toHaveBeenCalledTimes(1);
  });

  it("keeps the partial text and re-enables typing after a stop", () => {
    chat.status = "ready";
    chat.messages = [
      { id: "u1", role: "user", parts: [{ type: "text", text: "Hi" }] },
      { id: "a1", role: "assistant", parts: [{ type: "text", text: "Partial rep" }] },
    ];
    render(<Chat />);
    expect(screen.getByText("Partial rep")).toBeInTheDocument();
    expect(screen.getByLabelText("Your message")).toBeEnabled();
  });

  it("hides an assistant message that has no text", () => {
    chat.messages = [
      { id: "u1", role: "user", parts: [{ type: "text", text: "Hi" }] },
      { id: "a1", role: "assistant", parts: [{ type: "step-start" }] },
    ];
    render(<Chat />);
    expect(screen.getAllByText("Hi")).toHaveLength(1);
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("shows a fixed error message, not the raw error", () => {
    chat.error = new Error("secret provider detail");
    render(<Chat />);
    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong");
    expect(screen.queryByText(/secret provider detail/)).toBeNull();
  });
});
