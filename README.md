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
Week 1 — Environment and toolchain setup. No functional code yet.

## Setup
```bash
npm install
npm run dev
```

## License
MIT — see [LICENSE](./LICENSE)