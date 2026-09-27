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
- Backend: Node.js (lightweight API) + Nodemailer for incharge notifications
- No local server or LAN dependency required at the office

## Setup

```bash
npm install
```

Copy `.env.example` to `.env` and set `INCHARGE_EMAIL` plus SMTP credentials when you want live email. Without SMTP, submissions still succeed and the API logs the message that would have been emailed.

Run the form and API together:

```bash
npm run dev:all
```

- Form: http://localhost:5173
- Optional counter QR target: http://localhost:5173/?counter=2
- API: http://127.0.0.1:3001/api/health

## License
MIT — see [LICENSE](./LICENSE)
