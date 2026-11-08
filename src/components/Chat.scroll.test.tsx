// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
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

function msgs(count: number): TestMessage[] {
  return Array.from({ length: count }, (_, i) => ({
    id: "m" + i,
    role: i % 2 === 0 ? "user" : "assistant",
    parts: [{ type: "text", text: "message " + i }],
  }));
}

function setMetrics(
  el: HTMLElement,
  m: { scrollTop: number; clientHeight: number; scrollHeight: number }
) {
  Object.defineProperty(el, "scrollTop", {
    configurable: true,
    writable: true,
    value: m.scrollTop,
  });
  Object.defineProperty(el, "clientHeight", {
    configurable: true,
    value: m.clientHeight,
  });
  Object.defineProperty(el, "scrollHeight", {
    configurable: true,
    value: m.scrollHeight,
  });
}

beforeEach(() => {
  chat.messages = [];
  chat.status = "ready";
  chat.error = undefined;
  chat.sendMessage.mockReset();
  chat.stop.mockReset();
});

describe("Chat scrolling", () => {
  it("follows new content while the user is at the bottom", () => {
    chat.messages = msgs(2);
    const { rerender } = render(<Chat />);
    const log = screen.getByRole("log");
    setMetrics(log, { scrollTop: 900, clientHeight: 100, scrollHeight: 1000 });
    fireEvent.scroll(log);

    chat.messages = msgs(3);
    setMetrics(log, { scrollTop: 900, clientHeight: 100, scrollHeight: 2000 });
    rerender(<Chat />);

    expect(log.scrollTop).toBe(2000);
    expect(screen.queryByRole("button", { name: "Jump to latest" })).toBeNull();
  });

  it("stops following once the user scrolls up and shows Jump to latest", () => {
    chat.messages = msgs(2);
    const { rerender } = render(<Chat />);
    const log = screen.getByRole("log");
    setMetrics(log, { scrollTop: 0, clientHeight: 100, scrollHeight: 1000 });
    fireEvent.scroll(log);
    expect(
      screen.getByRole("button", { name: "Jump to latest" })
    ).toBeInTheDocument();

    chat.messages = msgs(3);
    setMetrics(log, { scrollTop: 0, clientHeight: 100, scrollHeight: 2000 });
    rerender(<Chat />);

    expect(log.scrollTop).toBe(0);
  });

  it("Jump to latest scrolls to the bottom and hides itself", async () => {
    const user = userEvent.setup();
    chat.messages = msgs(2);
    render(<Chat />);
    const log = screen.getByRole("log");
    setMetrics(log, { scrollTop: 0, clientHeight: 100, scrollHeight: 1000 });
    fireEvent.scroll(log);

    await user.click(screen.getByRole("button", { name: "Jump to latest" }));

    expect(log.scrollTop).toBe(1000);
    expect(screen.queryByRole("button", { name: "Jump to latest" })).toBeNull();
  });

  it("sending a message pins the view to the bottom again", async () => {
    const user = userEvent.setup();
    chat.messages = msgs(2);
    const { rerender } = render(<Chat />);
    const log = screen.getByRole("log");
    setMetrics(log, { scrollTop: 0, clientHeight: 100, scrollHeight: 1000 });
    fireEvent.scroll(log);

    await user.type(screen.getByLabelText("Your message"), "hello");
    await user.click(screen.getByRole("button", { name: "Send" }));
    expect(screen.queryByRole("button", { name: "Jump to latest" })).toBeNull();

    chat.messages = msgs(3);
    setMetrics(log, { scrollTop: 0, clientHeight: 100, scrollHeight: 3000 });
    rerender(<Chat />);
    expect(log.scrollTop).toBe(3000);
  });

  it("makes the conversation log reachable with the keyboard", () => {
    render(<Chat />);
    expect(screen.getByRole("log")).toHaveAttribute("tabindex", "0");
  });
});
