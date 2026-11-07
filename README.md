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
- Vitest for tests
- Deployed on Vercel, with a preview deployment for every push
- No local server or LAN dependency required

## Status
The app has a root layout, navigation and a routed placeholder for each screen: the feedback form (`/`), the confirmation page (`/thank-you`) and a health check (`/health`, with the same data at `/api/health`). The feedback form, validation and email delivery are not built yet.

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

On Vercel, set the same variables under the project's Environment Variables settings.

## Notes
- `npm audit` reports 13 findings (2 low, 11 moderate), all in packages used for linting and for the shadcn/ui setup: eslint-config-next, typescript-eslint, and the shadcn package with its dependencies. They have not been addressed: the fixes npm suggests would downgrade packages to older major versions.

## License
MIT - see [LICENSE](./LICENSE)

