# Secure Customer Onboarding & Profile Management Portal

A full-stack customer onboarding project for a financial-product style workflow. It models how customers register, update their profile, submit account details and move through review states.

The project focuses on secure data handling, backend validation, admin review screens and traceable customer status changes.

## Tech Stack

- Frontend: React, Vite, JavaScript, CSS
- Backend: Node.js, Express.js, REST APIs
- Data model: in-memory customer/profile records, structured so it can later be replaced with MySQL tables
- Security concepts: session simulation, validation, protected admin actions, audit timestamps, status history

## Features

### Customer Workflow

- Customer registration form
- Login/session simulation
- Profile creation and update
- Address and account-detail capture
- Form validation and clear error states
- Customer account status display

### Admin Workflow

- Admin review queue
- Approve or reject customer records
- Support notes and review reasons
- Status history for traceability
- Filtering by customer status

## Why this project matters

A payments or financial-product business needs clean onboarding flows because customer records affect account access, support workflows and data accuracy.

This project demonstrates:

- how frontend form states connect to backend validation
- how customer records can move through review states
- why status history and audit timestamps matter
- how admin actions should be separated from customer actions

## Run Locally

```bash
cd secure-customer-onboarding-portal
npm install
npm run dev
```

Frontend: http://localhost:5175  
Backend: http://localhost:4200/api/health

Demo customer login:

```text
Email: customer@example.com
Password: demo123
```

Demo admin login:

```text
Email: admin@example.com
Password: admin123
```

## API Routes

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Login as customer or admin |
| GET | `/api/profile` | Get current customer profile |
| PUT | `/api/profile` | Update customer profile |
| GET | `/api/admin/customers` | Admin customer review queue |
| POST | `/api/admin/customers/:id/decision` | Approve or reject customer |
| GET | `/api/audit` | View status history |

## Interview Talking Points

- I separated customer profile updates from admin review actions.
- I used backend validation to reduce incomplete or invalid customer records.
- I modelled account status transitions such as DRAFT, SUBMITTED, APPROVED and REJECTED.
- I added status history so admin decisions can be traced later.
- This mirrors the type of onboarding flow used in customer-facing financial web products.
