import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUTBOX = join(ROOT, "outbox");
const SERVICE_TYPES = new Set([
  "installment",
  "duplicate_bill",
  "name_address_correction",
  "bank_query",
  "high_billing",
  "other",
]);

function inchargeEmail() {
  return process.env.INCHARGE_EMAIL || "cfc-incharge@localhost";
}

function digitsOnly(value) {
  return String(value ?? "").replace(/\D/g, "");
}

function isRepeatedDigitNumber(digits) {
  return digits.length > 0 && /^(\d)\1+$/.test(digits);
}

function validatePayload(body) {
  if (!body || typeof body !== "object") {
    return "Invalid payload.";
  }

  if (!String(body.customerName ?? "").trim()) {
    return "Customer name is required.";
  }

  const mobile = digitsOnly(body.mobileNumber);
  if (mobile.length < 10 || mobile.length > 13) {
    return "Enter a valid mobile number (10 to 13 digits).";
  }
  if (isRepeatedDigitNumber(mobile)) {
    return "This mobile number looks implausible. Enter a real number.";
  }

  const consumer = String(body.consumerNumber ?? "").trim();
  if (consumer && !/^[A-Za-z0-9/-]{4,20}$/.test(consumer)) {
    return "Consumer number must be 4 to 20 characters (letters, numbers, hyphens, or slashes).";
  }

  if (!SERVICE_TYPES.has(body.serviceType)) {
    return "Select a service type.";
  }

  if (body.counter !== undefined && body.counter !== null && body.counter !== "") {
    const n = Number(body.counter);
    if (!Number.isInteger(n) || n < 1 || n > 5) {
      return "Counter must be a number from 1 to 5.";
    }
  }

  if (!Number.isInteger(body.rating) || body.rating < 1 || body.rating > 5) {
    return "Select a rating from 1 to 5.";
  }

  const comments = String(body.comments ?? "").trim();
  if (comments.length < 8) {
    return "Comments must be at least 8 characters.";
  }

  return null;
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8") || "{}";
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function formatEmail(body) {
  const to = inchargeEmail();
  const consumer = body.consumerNumber ? body.consumerNumber : "(not provided)";
  const counter = body.counter ? String(body.counter) : "(not provided)";

  return [
    `To: ${to}`,
    "Subject: Customer Facilitation Center feedback",
    "Content-Type: text/plain; charset=utf-8",
    "",
    `Customer name: ${body.customerName}`,
    `Mobile number: ${body.mobileNumber}`,
    `Consumer/account number: ${consumer}`,
    `Service type: ${body.serviceType}`,
    `Counter: ${counter}`,
    `Rating: ${body.rating}`,
    "Comments:",
    body.comments,
    "",
  ].join("\n");
}

export async function handleFeedbackRequest(req, res) {
  try {
    const body = await readJsonBody(req);
    const error = validatePayload(body);
    if (error) {
      sendJson(res, 400, { ok: false, error });
      return;
    }

    await mkdir(OUTBOX, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filePath = join(OUTBOX, `feedback-${stamp}.eml`);
    await writeFile(filePath, formatEmail(body), "utf8");

    sendJson(res, 200, { ok: true });
  } catch {
    sendJson(res, 500, { ok: false, error: "Could not send feedback. Try again." });
  }
}
