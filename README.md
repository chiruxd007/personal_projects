# Personal Projects Portfolio

A portfolio of software engineering projects across full-stack web development, backend APIs, SQL databases, fintech-style workflows, systems programming and game development.

## Featured Project: FX Multi-Currency Wallet & Currency Conversion Platform

**Project folder:** [`fx-wallet-platform/`](./fx-wallet-platform)

A full-stack fintech portfolio project built with React, Node.js, Express and MySQL. It models the core workflow of an international payments product: customer wallets, FX quotes, quote expiry, transfer confirmation, debit/credit ledger entries, transaction history, audit logs and admin reconciliation.

### Tech Stack

- Frontend: React, Vite, JavaScript, CSS
- Backend: Node.js, Express.js, REST APIs
- Database: MySQL 8
- Security concepts: JWT authentication, role-based admin routes, validation, audit logs
- Tooling: Git, GitHub, Docker Compose, npm workspaces

### Main Features

- Customer login with JWT authentication
- Multi-currency wallet balances
- Wallet creation and demo wallet funding
- FX quote generation with rate, fee, converted amount and expiry time
- Quote confirmation flow
- Ledger-based wallet accounting using immutable debit and credit entries
- Transaction history
- Admin reconciliation dashboard
- Audit logs for operational review
- Simulated provider-adapter pattern for future payment API integration

### Run Locally

```bash
cd fx-wallet-platform
docker compose up -d
npm install
cp .env.example .env
npm run seed --workspace server
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend health check:

```text
http://localhost:4000/api/health
```

Demo login:

```text
Email: chirantan@example.com
Password: demo123
Role: ADMIN
```

### Interview Talking Points

- Wallet balances are calculated from ledger entries instead of being overwritten directly.
- Quote confirmation uses a database transaction so the source debit and destination credit stay consistent.
- FX quotes expire after a fixed time window to model real pricing behaviour.
- Admin reconciliation and audit logs help support teams investigate transaction issues.
- The provider-adapter structure keeps external payment-provider logic separate from internal wallet logic.

## Other Projects

### C++ Media Metadata Parser

A low-level parser for reading media headers and extracting structured metadata using binary file I/O, byte-level parsing and error handling.

### Custom Memory Allocator

A simplified heap allocator demonstrating manual memory management, free lists, block splitting and block coalescing.

### Multithreaded Thread Pool

A concurrent task execution project demonstrating worker threads, mutex synchronization, condition variables and producer-consumer queues.

### Video Frame Processing Pipeline

A multithreaded staged pipeline simulating media processing workflows and inter-thread communication.

### Mini Image Editor

A lightweight image manipulation project with filters such as invert, grayscale, brightness adjustment, blur and horizontal flip.

## Skills Demonstrated

- React frontend development
- Node.js and Express API design
- REST APIs
- MySQL schema design
- SQL ledger and reporting queries
- JWT authentication
- Role-based access concepts
- Audit logging
- Reconciliation workflows
- Git/GitHub workflow
- Docker-based local development
- C++ systems programming
- Debugging and testing mindset

## Author

Chirantan Kundu  
B.Sc. Computer and Software Systems — University of Melbourne
