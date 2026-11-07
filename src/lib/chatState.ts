export type ChatStatusValue = "submitted" | "streaming" | "ready" | "error";

export interface MessageLike {
  role: string;
  parts: ReadonlyArray<{ type: string; text?: string }>;
}

/** Joins the text parts of a message. Other part types are ignored. */
export function getMessageText(message: MessageLike): string {
  return message.parts
    .filter((part) => part.type === "text" && typeof part.text === "string")
    .map((part) => part.text as string)
    .join("");
}

/**
 * True while the assistant has been asked to reply but no text has
 * arrived yet: right after sending, or when streaming has started but
 * the first token has not.
 */
export function shouldShowThinking(
  status: ChatStatusValue,
  messages: ReadonlyArray<MessageLike>
): boolean {
  if (status === "submitted") return true;
  if (status !== "streaming") return false;
  const last = messages[messages.length - 1];
  return (
    last !== undefined &&
    last.role === "assistant" &&
    getMessageText(last).trim() === ""
  );
}
