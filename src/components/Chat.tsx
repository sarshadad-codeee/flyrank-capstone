"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import { MessageContent } from "@/components/MessageContent";
import { MAX_USER_MESSAGE_CHARS } from "@/lib/chatConfig";
import { getMessageText, shouldShowThinking } from "@/lib/chatState";
import { isNearBottom } from "@/lib/scrollPin";

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
  const [showJump, setShowJump] = useState<boolean>(false);

  const logRef = useRef<HTMLDivElement | null>(null);
  // True while the view should follow new content. Kept in a ref so that
  // content growing (which fires no scroll event) cannot flip it.
  const pinnedRef = useRef<boolean>(true);

  const busy = status === "submitted" || status === "streaming";
  const thinking = shouldShowThinking(status, messages);

  useEffect(() => {
    const el = logRef.current;
    if (el && pinnedRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, thinking]);

  function handleScroll() {
    const el = logRef.current;
    if (!el) return;
    const near = isNearBottom(el.scrollTop, el.clientHeight, el.scrollHeight);
    pinnedRef.current = near;
    setShowJump(!near);
  }

  function jumpToLatest() {
    const el = logRef.current;
    if (!el) return;
    pinnedRef.current = true;
    setShowJump(false);
    el.scrollTop = el.scrollHeight;
  }

  function submit() {
    const text = input.trim();
    if (text === "" || busy) return;
    pinnedRef.current = true;
    setShowJump(false);
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
    <div className="flex h-[70dvh] min-h-80 flex-col gap-3">
      <div className="relative min-h-0 flex-1">
        <div
          ref={logRef}
          onScroll={handleScroll}
          role="log"
          aria-label="Conversation"
          tabIndex={0}
          className="h-full space-y-3 overflow-y-auto overscroll-contain rounded-lg border border-border p-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
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
                  "max-w-[85%] break-words rounded-2xl px-4 py-3 " +
                  (message.role === "user"
                    ? "whitespace-pre-wrap bg-primary text-primary-foreground"
                    : "bg-muted text-foreground")
                }
              >
                {message.role === "user" ? text : <MessageContent text={text} />}
              </div>
            </div>
          ))}
          {thinking && <ThinkingBubble />}
        </div>
        {showJump && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={jumpToLatest}
            className="absolute bottom-3 left-1/2 h-9 -translate-x-1/2 px-4 shadow"
          >
            Jump to latest
          </Button>
        )}
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
          enterKeyHint="send"
          autoComplete="off"
          placeholder="Type your message"
          className="min-h-12 flex-1 resize-none rounded-lg border border-border bg-background p-3 text-base"
        />
        {busy ? (
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-11 min-w-16"
            onClick={() => stop()}
          >
            Stop
          </Button>
        ) : (
          <Button
            type="submit"
            size="lg"
            className="h-11 min-w-16"
            disabled={input.trim() === ""}
          >
            Send
          </Button>
        )}
      </form>
    </div>
  );
}
