"use client";

import { useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import { MAX_USER_MESSAGE_CHARS } from "@/lib/chatConfig";
import { getMessageText, shouldShowThinking } from "@/lib/chatState";

const transport = new DefaultChatTransport({ api: "/api/chat" });

const ERROR_TEXT = "Something went wrong. Please try again.";

function ThinkingBubble() {
  return (
    <div className="flex justify-start">
      <div
        role="status"
        className="rounded-2xl bg-muted px-4 py-3 text-foreground"
      >
        <span className="sr-only">The assistant is thinking</span>
        <span aria-hidden="true" className="flex gap-1">
          <span className="size-2 rounded-full bg-muted-foreground motion-safe:animate-pulse" />
          <span className="size-2 rounded-full bg-muted-foreground motion-safe:animate-pulse [animation-delay:150ms]" />
          <span className="size-2 rounded-full bg-muted-foreground motion-safe:animate-pulse [animation-delay:300ms]" />
        </span>
      </div>
    </div>
  );
}

export function Chat() {
  const { messages, sendMessage, status, stop, error } = useChat({ transport });
  const [input, setInput] = useState<string>("");

  const busy = status === "submitted" || status === "streaming";
  const thinking = shouldShowThinking(status, messages);

  function submit() {
    const text = input.trim();
    if (text === "" || busy) return;
    sendMessage({ text });
    setInput("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  }

  const visible = messages
    .map((message) => ({ message, text: getMessageText(message) }))
    .filter((item) => item.text.trim() !== "");

  return (
    <div className="flex h-[70dvh] flex-col gap-3">
      <div
        role="log"
        aria-label="Conversation"
        className="flex-1 space-y-3 overflow-y-auto rounded-lg border border-border p-3"
      >
        {visible.length === 0 && !thinking && (
          <p className="text-muted-foreground">
            Tell me what happened with your gas service and I will help you
            put it into a clear message for the feedback form.
          </p>
        )}
        {visible.map(({ message, text }) => (
          <div
            key={message.id}
            className={
              message.role === "user" ? "flex justify-end" : "flex justify-start"
            }
          >
            <div
              className={
                "max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 " +
                (message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground")
              }
            >
              {text}
            </div>
          </div>
        ))}
        {thinking && <ThinkingBubble />}
      </div>

      {error && (
        <p role="alert" className="text-destructive">
          {ERROR_TEXT}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <label htmlFor="chat-input" className="sr-only">
          Your message
        </label>
        <textarea
          id="chat-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={MAX_USER_MESSAGE_CHARS}
          rows={2}
          placeholder="Type your message"
          className="min-h-12 flex-1 resize-none rounded-lg border border-border bg-background p-3 text-base"
        />
        {busy ? (
          <Button type="button" variant="outline" size="lg" onClick={() => stop()}>
            Stop
          </Button>
        ) : (
          <Button type="submit" size="lg" disabled={input.trim() === ""}>
            Send
          </Button>
        )}
      </form>
    </div>
  );
}
