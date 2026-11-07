import {
  MAX_ASSISTANT_MESSAGE_CHARS,
  MAX_MESSAGES,
  MAX_USER_MESSAGE_CHARS,
} from "./chatConfig";

export interface ChatTextPart {
  type: "text";
  text: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  parts: ChatTextPart[];
}

export type ChatValidation =
  | { ok: true; messages: ChatMessage[] }
  | { ok: false; error: string };

function fail(error: string): ChatValidation {
  return { ok: false, error };
}

/**
 * Checks an untrusted request body and returns a cleaned message list.
 * Only text parts are kept, and messages with no text (for example a
 * reply that was stopped before its first token) are dropped so the
 * model API never receives an empty message.
 */
export function validateChatRequest(body: unknown): ChatValidation {
  if (typeof body !== "object" || body === null) {
    return fail("The request body must be an object.");
  }
  const raw = (body as { messages?: unknown }).messages;
  if (!Array.isArray(raw)) return fail("messages must be an array.");
  if (raw.length === 0) return fail("messages must not be empty.");
  if (raw.length > MAX_MESSAGES) return fail("Too many messages.");

  const messages: ChatMessage[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) {
      return fail("Each message must be an object.");
    }
    const candidate = item as { id?: unknown; role?: unknown; parts?: unknown };
    if (candidate.role !== "user" && candidate.role !== "assistant") {
      return fail("Unsupported message role.");
    }
    if (!Array.isArray(candidate.parts)) {
      return fail("Each message needs a parts array.");
    }
    const role: "user" | "assistant" =
      candidate.role === "user" ? "user" : "assistant";

    const parts: ChatTextPart[] = [];
    let chars = 0;
    for (const entry of candidate.parts) {
      if (typeof entry !== "object" || entry === null) continue;
      const part = entry as { type?: unknown; text?: unknown };
      if (part.type !== "text" || typeof part.text !== "string") continue;
      parts.push({ type: "text", text: part.text });
      chars += part.text.length;
    }

    const limit =
      role === "user" ? MAX_USER_MESSAGE_CHARS : MAX_ASSISTANT_MESSAGE_CHARS;
    if (chars > limit) return fail("A message is too long.");

    if (!parts.some((part) => part.text.trim().length > 0)) continue;

    const id =
      typeof candidate.id === "string" && candidate.id.length > 0
        ? candidate.id
        : "m" + messages.length;
    messages.push({ id, role, parts });
  }

  if (messages.length === 0) return fail("No usable messages.");
  if (messages[0].role !== "user") {
    return fail("The first message must come from the user.");
  }
  if (messages[messages.length - 1].role !== "user") {
    return fail("The last message must come from the user.");
  }
  return { ok: true, messages };
}
