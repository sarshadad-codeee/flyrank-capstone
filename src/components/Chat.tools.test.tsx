// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

interface TestMessage {
  id: string;
  role: string;
  parts: Array<Record<string, unknown>>;
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

const output = {
  category: "high_billing",
  categoryLabel: "High billing",
  urgency: "normal",
  summary: "My gas bill doubled this month.",
};

function toolMessage(part: Record<string, unknown>): TestMessage {
  return {
    id: "a1",
    role: "assistant",
    parts: [{ type: "tool-draftFeedback", toolCallId: "t1", ...part }],
  };
}

beforeEach(() => {
  chat.messages = [];
  chat.status = "ready";
  chat.error = undefined;
});

describe("Chat tool parts", () => {
  it("shows a message that has only a tool part, as a result card", () => {
    chat.messages = [toolMessage({ state: "output-available", input: {}, output })];
    render(<Chat />);
    expect(screen.getByRole("group", { name: "Feedback summary" })).toBeInTheDocument();
    expect(screen.getByText("High billing")).toBeInTheDocument();
  });

  it("shows the drafting card and no thinking dots while the input streams", () => {
    chat.status = "streaming";
    chat.messages = [toolMessage({ state: "input-streaming", input: { category: "high_billing" } })];
    render(<Chat />);
    expect(screen.getAllByRole("status")).toHaveLength(1);
    expect(screen.getByText("Drafting your feedback summary")).toBeInTheDocument();
  });

  it("shows the working card once the input is available", () => {
    chat.status = "streaming";
    chat.messages = [toolMessage({ state: "input-available", input: { summary: "A summary here." } })];
    render(<Chat />);
    expect(screen.getByText("Saving the draft")).toBeInTheDocument();
  });

  it("shows a failed tool as a designed error, not a crash", () => {
    chat.messages = [
      toolMessage({ state: "output-error", errorText: "This sounds like an emergency, so it cannot be filed." }),
    ];
    render(<Chat />);
    expect(screen.getByRole("alert")).toHaveTextContent("emergency");
    expect(screen.getByText("This cannot be filed as feedback")).toBeInTheDocument();
  });

  it("keeps text and the tool card in order", () => {
    chat.messages = [
      {
        id: "a1",
        role: "assistant",
        parts: [
          { type: "text", text: "Here is your draft" },
          { type: "tool-draftFeedback", toolCallId: "t1", state: "output-available", input: {}, output },
        ],
      },
    ];
    render(<Chat />);
    const text = screen.getByText("Here is your draft");
    const card = screen.getByRole("group", { name: "Feedback summary" });
    expect(text.compareDocumentPosition(card) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("ignores tool parts from other tools", () => {
    chat.messages = [
      { id: "a1", role: "assistant", parts: [{ type: "tool-other", state: "output-available" }] },
    ];
    render(<Chat />);
    expect(screen.queryByRole("group")).toBeNull();
  });
});
