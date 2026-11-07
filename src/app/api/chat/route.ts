import { anthropic } from "@ai-sdk/anthropic";
import { convertToModelMessages, streamText } from "ai";
import {
  CHAT_MODEL,
  MAX_OUTPUT_TOKENS,
  SYSTEM_PROMPT,
} from "@/lib/chatConfig";
import { validateChatRequest } from "@/lib/validateChatRequest";

/** Upper bound on the raw request body, checked before parsing. */
const MAX_BODY_CHARS = 100_000;

/** Text shown to the user when the stream fails. No provider details. */
const STREAM_ERROR_TEXT = "Something went wrong. Please try again.";

function jsonError(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
}

/**
 * Streams a reply to the conversation in the request body.
 * The API key is read from the server environment by the provider and
 * is never sent to the browser.
 */
export async function POST(request: Request): Promise<Response> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return jsonError("Chat is not configured.", 500);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_CHARS) {
    return jsonError("Request too large.", 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return jsonError("Invalid JSON.", 400);
  }

  const checked = validateChatRequest(body);
  if (!checked.ok) {
    return jsonError(checked.error, 400);
  }

  const result = streamText({
    model: anthropic(CHAT_MODEL),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(checked.messages),
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    abortSignal: request.signal,
  });

  return result.toUIMessageStreamResponse({
    onError: () => STREAM_ERROR_TEXT,
  });
}
