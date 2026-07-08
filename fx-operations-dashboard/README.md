# FX Operations Admin Dashboard & Reconciliation Tool

A full-stack fintech operations project that models how an internal support or payments operations team can search, filter, review and reconcile FX transactions.

This project is designed to complement the FX wallet platform by focusing on the **admin and operational side** of payments: exception handling, transaction review, support notes, reconciliation summaries and CSV-style reporting.

## Tech Stack

- Frontend: React, Vite, JavaScript, CSS
- Backend: Node.js, Express.js, REST APIs
- Data model: in-memory sample FX transaction data, structured to be replaceable with MySQL queries
- Concepts: reconciliation, exception reports, admin workflows, role-based access concepts, payment status review

## Features

- Transaction search by customer, currency pair, status and risk flag
- Operations summary cards for completed, pending, failed and flagged transfers
- Exception report for transactions requiring manual review
- Admin support notes for failed or review-required transfers
- CSV export endpoint for operations reporting
- Clean dashboard UI for non-technical users

## Why this project matters

Payments companies need internal tools, not just customer-facing screens. When a transfer fails, expires, mismatches, or needs review, support and operations teams need clear visibility into:

- current payment status
- customer and currency pair
- quoted amount and settlement amount
- exception reason
- support notes
- reconciliation mismatches

## Run Locally

```bash
cd fx-operations-dashboard
npm install
npm run dev
```

Frontend: http://localhost:5174  
Backend: http://localhost:4100/api/health

## API Routes

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/transactions` | Filter and list FX transactions |
| GET | `/api/reconciliation` | Summary and exception report |
| POST | `/api/transactions/:id/notes` | Add support/admin note |
| GET | `/api/export/transactions.csv` | Download transaction CSV |

## Interview Talking Points

- I separated customer-facing wallet flows from internal operations workflows.
- The dashboard helps support teams investigate failed, pending and flagged payments quickly.
- Reconciliation compares quote records, ledger events and transfer states to detect mismatches.
- The backend filtering logic mirrors how indexed SQL queries would work in a production database.
- CSV export is useful for finance, operations and manual review workflows.
