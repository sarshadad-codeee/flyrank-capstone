import { google } from "@ai-sdk/google";
import { convertToModelMessages, stepCountIs, streamText } from "ai";
import {
  CHAT_MODEL,
  MAX_OUTPUT_TOKENS,
  MAX_TOOL_STEPS,
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS,
  SYSTEM_PROMPT,
} from "@/lib/chatConfig";
import { createRateLimiter, getClientKey } from "@/lib/rateLimit";
import { describeStreamError } from "@/lib/streamError";
import { draftFeedbackTool } from "@/lib/tools/draftFeedback";
import { validateChatRequest } from "@/lib/validateChatRequest";

/** Upper bound on the raw request body, checked before parsing. */
const MAX_BODY_CHARS = 100_000;

const limiter = createRateLimiter({
  limit: RATE_LIMIT_MAX,
  windowMs: RATE_LIMIT_WINDOW_MS,
});

function jsonError(
  message: string,
  status: number,
  headers?: Record<string, string>
): Response {
  return Response.json({ error: message }, { status, headers });
}

/**
 * Streams a reply to the conversation in the request body, and lets the
 * model call the draftFeedback tool. Tools run on the server only, and
 * the client sends text history only, so it cannot forge a tool result.
 * The API key is read from the server environment by the provider and
 * is never sent to the browser.
 */
export async function POST(request: Request): Promise<Response> {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return jsonError("Chat is not configured.", 500);
  }

  const verdict = limiter.check(getClientKey(request.headers));
  if (!verdict.allowed) {
    return jsonError("Too many requests. Please wait a moment.", 429, {
      "Retry-After": String(verdict.retryAfterSeconds),
    });
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
    model: google(CHAT_MODEL),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(checked.messages),
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    tools: { draftFeedback: draftFeedbackTool },
    stopWhen: stepCountIs(MAX_TOOL_STEPS),
    abortSignal: request.signal,
  });

  return result.toUIMessageStreamResponse({
    onError: describeStreamError,
  });
}
