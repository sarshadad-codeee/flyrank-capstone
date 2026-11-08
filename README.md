# Customer Feedback Module - Gas Utility Facilitation Center

## Overview
A feedback collection system for a gas utility's Customer Facilitation Center, where counter staff currently have no way to capture customer feedback after service (bill installment, duplicate bill, name/address correction, bank query, high billing complaints, etc.).

## Problem
- No internet access for staff or the incharge at the office.
- Customer feedback is currently not captured at all.

## Solution
- A static QR/barcode is placed at each counter.
- Customers scan it using their own phone and mobile data (no office network involved).
- Feedback is submitted through a simple web form.
- On submission, the incharge receives the feedback directly via **email** - no login, no dashboard, no internet needed at the office.

## Stack
- Next.js (App Router), React and TypeScript
- Tailwind CSS, with design tokens in `src/app/globals.css`
- Server logic in Next.js route handlers (`src/app/api`), plus an email service for notifications
- Vitest and Testing Library for tests
- AI SDK with the Google Gemini provider for the streaming feedback assistant
- Deployed on Vercel, with a preview deployment for every push
- No local server or LAN dependency required

## Status
The app has a root layout, navigation and a routed placeholder for each screen: the feedback form (`/`), the confirmation page (`/thank-you`) and a health check (`/health`, with the same data at `/api/health`). A feedback assistant at `/chat` streams AI replies from a route handler (`/api/chat`) to help customers describe their feedback; it has a stop button, scroll-aware auto-scroll and markdown rendering, and it cannot send feedback itself. The feedback form, validation and email delivery are not built yet.

## Live preview
https://flyrank-capstone-pink.vercel.app/

## Setup
```bash
npm install
npm run dev
```

The app opens at http://localhost:3000.

## Scripts
- `npm run dev` - start the development server
- `npm run build` - type-check and build for production
- `npm start` - run the production build
- `npm test` - run the Vitest tests
- `npm run lint` - run ESLint

## Environment variables
Copy `.env.example` to `.env.local` and fill in the values. Real values are never committed.

| Variable | Where it is used | Notes |
|---|---|---|
| `INCHARGE_EMAIL` | Server only | Address that receives feedback. Never prefix it with `NEXT_PUBLIC_`. |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Server only | Key for the Gemini API used by the chat route. Never prefix it with `NEXT_PUBLIC_`. |

On Vercel, set the same variables under the project's Environment Variables settings.

## Chat tool contract
The chat route (`/api/chat`) gives the model one server-side tool. It is defined in `src/lib/tools/draftFeedback.ts` and runs on the server only. The browser sends text history only, so it cannot supply a tool result.

**Name:** `draftFeedback`

**When it runs:** after the customer has described a clear service issue. It is never used for a gas smell, a leak or a safety danger.

**Input** (Zod schema)

| Field | Type | Required | Notes |
|---|---|---|---|
| `category` | `bill_installment`, `duplicate_bill`, `name_or_address_correction`, `bank_query`, `high_billing`, `other` | yes | The kind of service issue |
| `urgency` | `low`, `normal`, `high`, `emergency` | yes | `emergency` is refused by the tool |
| `summary` | string, 10 to 300 characters, trimmed | yes | The issue in the customer's words |
| `details` | string, up to 500 characters | no | Dates, amounts or places |
| `desiredOutcome` | string, up to 200 characters | no | What the customer wants |

**Output** (returned on success)

```ts
{
  category: string;
  categoryLabel: string;            // for example "High billing"
  urgency: "low" | "normal" | "high";
  summary: string;
  details?: string;                 // left out when not given
  desiredOutcome?: string;          // left out when not given
}
```

**Error:** an `emergency` urgency throws `EmergencyReportError`, and its message is shown in the chat as a red card. Any other failure shows a generic message, with no provider details.

**How the UI shows each state** (`src/lib/toolView.ts` and `src/components/ToolCard.tsx`)

| Tool part state | Question it answers | What the user sees |
|---|---|---|
| `input-streaming` | What is it doing? | A shimmering card with any fields that have arrived |
| `input-available` | With what input? | Labelled input rows and a "Saving the draft" line |
| `output-available` | What came back? | A summary card with category and urgency badges |
| `output-error` | What went wrong? | A red card with the reason and, for a normal error, a next step |

## Notes
- `npm audit` reports 13 findings (2 low, 11 moderate), all in packages used for linting and for the shadcn/ui setup: eslint-config-next, typescript-eslint, and the shadcn package with its dependencies. They have not been addressed: the fixes npm suggests would downgrade packages to older major versions.

## License
MIT - see [LICENSE](./LICENSE)

