# FX Multi-Currency Wallet & Currency Conversion Platform

A full-stack fintech portfolio project built to model the core workflows of an international payments platform: customer wallets, FX quotes, quote expiry, simulated transfer confirmation, transaction ledgers, audit logs, admin review and reconciliation reporting.

This project is designed around the same engineering themes used in small production fintech teams: clear API boundaries, secure customer data handling, ledger-style transaction records, predictable failure states and support/admin visibility.

## Tech stack

- Frontend: React, Vite, JavaScript, CSS
- Backend: Node.js, Express.js, REST APIs
- Database: MySQL 8, SQL schema design
- Security concepts: JWT authentication, role-based admin routes, validation, audit logging, Helmet
- Tooling: Git/GitHub, npm workspaces, Docker Compose

## Features

### Customer wallet features

- Login with JWT authentication
- View multi-currency wallet balances
- Create wallets for supported currencies
- Add demo funds to wallets
- Generate FX conversion quotes
- Confirm valid quotes before expiry
- View debit/credit ledger transaction history

### FX quote flow

- Quote includes source amount, FX rate, platform fee, converted amount and expiry time
- Quote confirmation checks wallet existence, expiry, status and available balance
- Confirmed conversion writes two ledger entries: one source wallet debit and one destination wallet credit
- Provider interaction is simulated through an adapter-style API pattern so it can later be replaced with CurrencyCloud, Wise, Stripe, Airwallex or another payments provider

### Admin / operations features

- Admin reconciliation dashboard
- Summary of quotes, active quotes, completed transfers and FX ledger entries
- Exception report for confirmed transfers that do not have the expected ledger entries
- Audit log visibility for wallet creation, funding, quote creation and confirmation

## Why the ledger design matters

This project deliberately avoids simply overwriting wallet balances. Instead, balances are calculated from immutable ledger entries. That makes every balance movement traceable and easier to review, which is important for fintech, payments, reconciliation and support workflows.

Example:

- AUD wallet receives a CREDIT for demo funding
- User confirms an AUD to USD quote
- AUD wallet receives a DEBIT ledger entry
- USD wallet receives a CREDIT ledger entry
- The transaction can be audited through reference IDs and audit logs

## Local setup

### 1. Start MySQL

```bash
docker compose up -d
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

```bash
cp .env.example .env
```

### 4. Seed demo data

```bash
npm run seed --workspace server
```

Demo login:

```text
Email: chirantan@example.com
Password: demo123
Role: ADMIN
```

### 5. Run the project

```bash
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:4000/api/health

## API routes

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/wallets` | List customer wallets and calculated balances |
| POST | `/api/wallets` | Create a new currency wallet |
| POST | `/api/wallets/:id/fund` | Add demo funding credit |
| POST | `/api/quotes` | Generate an FX quote |
| POST | `/api/quotes/:id/confirm` | Confirm a quote and create ledger movements |
| GET | `/api/transactions` | View ledger transaction history |
| GET | `/api/admin/reconciliation` | Admin reconciliation summary and exception report |
| GET | `/api/admin/audit` | Admin audit trail |

## Interview talking points

If asked about this project, explain these decisions:

1. **Ledger over mutable balances**: wallet balances are derived from ledger entries so movements are traceable.
2. **Quote expiry**: FX quotes expire after a fixed window because real market prices move.
3. **Transaction safety**: confirming a quote uses a database transaction so debit and credit movements happen together.
4. **Provider adapter pattern**: internal quote/transfer logic is separated from the external provider interface.
5. **Admin visibility**: support teams need reconciliation, exception reports and audit trails to investigate payment issues.
6. **Security basics**: JWT auth, admin-only endpoints, validation and careful handling of customer/financial data.

## Future improvements

- Replace simulated FX rates with a live FX rate provider
- Add real CurrencyCloud sandbox integration
- Add beneficiary management and payout instructions
- Add Jest/Vitest API tests
- Add GitHub Actions CI workflow
- Add deployed demo using Render/Railway + managed MySQL
