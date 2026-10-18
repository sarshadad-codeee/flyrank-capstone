# Customer Feedback Module — Gas Utility Facilitation Center

## Overview
A feedback collection system for a gas utility's Customer Facilitation Center, where counter staff currently have no way to capture customer feedback after service (bill installment, duplicate bill, name/address correction, bank query, high billing complaints, etc.).

## Problem
- No internet access for staff or the incharge at the office.
- Customer feedback is currently not captured at all.

## Solution
- A static QR/barcode is placed at each counter.
- Customers scan it using their own phone and mobile data (no office network involved).
- Feedback is submitted through a simple web form.
- On submission, the incharge receives the feedback directly via **email** — no login, no dashboard, no internet needed at the office.

## Stack
- Frontend: React + TypeScript + Vite (customer-facing feedback form)
- Backend: Node.js (serverless function or lightweight API) + email service (e.g. Nodemailer/SendGrid) for notifications
- No local server or LAN dependency required

## Status
Round 2 - Customer feedback form, validation, local email outbox, and unit tests.

## Setup

```bash
npm install
npm run dev
```

Opens the Vite app at the URL printed in the terminal. QR links can include a counter, for example `http://localhost:5173/?counter=2`.

Submit writes a local `.eml` file under `server/outbox`. The incharge address lives only in `INCHARGE_EMAIL` on the server (`server/.env.example`). It is never sent to the browser.

```bash
npm test
```


## License
MIT — see [LICENSE](./LICENSE)