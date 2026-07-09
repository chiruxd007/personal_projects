# Personal Projects Portfolio

A portfolio of software engineering and digital marketing projects across content marketing, social media coordination, localisation, digital reporting, full-stack web development, backend APIs, SQL databases, SEO/GEO, analytics, fintech-style workflows, systems programming and game development.

## Featured Content Marketing Portfolio

## Nintendo Australia Content Marketing Portfolio

**Project folder:** [`nintendo-content-marketing-portfolio/`](./nintendo-content-marketing-portfolio)

An independent application portfolio for a Nintendo Australia Content Marketing Coordinator role. It demonstrates social content calendar coordination, localisation thinking, copywriting by channel, Switch News-style content, weekly owned-channel reporting, moderation judgement and fan/community empathy.

### Main Artefacts

- Forward-planned social content calendar
- Localised social and Switch News copy samples
- Weekly digital activity reporting template
- Community moderation and monitoring approach
- Zelda campaign story explaining Nintendo brand passion

### Interview Talking Points

- Nintendo content needs originality, flexibility and sincerity while still staying accurate and globally aligned.
- Strong content coordination means protecting campaign timing, localising carefully and matching copy to each channel.
- Community monitoring is a feedback loop: fan comments show what people love, misunderstand or want clarified.
- My technical background helps with digital reporting, content organisation, scheduling systems and performance analysis.

---

## Featured Digital Marketing / SEO / AI Visibility Portfolio

## Digital Content, SEO & AI Visibility Portfolio

**Project folder:** [`digital-content-seo-portfolio/`](./digital-content-seo-portfolio)

An independent content-strategy portfolio for an energy-retail style digital team. It demonstrates content roadmap planning, SEO/GEO content briefs, blog article samples, GA4 measurement thinking, AI visibility strategy, customer-experience content and conversion/self-service reporting.

### Main Artefacts

- 90-day energy content roadmap for a Living Energy-style blog
- SEO and GEO content briefs for customer energy topics
- Customer-friendly blog article samples
- GA4 event tracking and content measurement framework
- AI visibility strategy for LLM / answer-engine discovery
- Stakeholder-friendly reporting structure for marketing, digital, SME and customer teams

### Interview Talking Points

- Content should be measured by customer action and self-service outcomes, not only page views.
- GEO works best when content is structured, accurate, answerable and supported by authority signals.
- My technical background helps me understand event tracking, website structure, dashboards and AI discovery.
- Energy content needs plain English because customers often arrive confused, stressed or comparison-shopping.

---

## Featured Full-Stack / Fintech Projects

## 1. FX Multi-Currency Wallet & Currency Conversion Platform

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

Frontend: `http://localhost:5173`  
Backend health check: `http://localhost:4000/api/health`

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

---

## 2. FX Operations Admin Dashboard & Reconciliation Tool

**Project folder:** [`fx-operations-dashboard/`](./fx-operations-dashboard)

A full-stack internal operations dashboard for reviewing simulated FX transactions, filtering payment states, identifying exceptions, adding support notes and exporting transaction reports.

### Main Features

- Transaction search by customer, transaction ID, status, currency pair and risk flag
- Operations summary cards for completed, pending, failed and review-required transfers
- Exception report for payments needing manual review
- Support note workflow
- CSV export endpoint
- React dashboard designed for non-technical operations users

### Run Locally

```bash
cd fx-operations-dashboard
npm install
npm run dev
```

Frontend: `http://localhost:5174`  
Backend health check: `http://localhost:4100/api/health`

---

## 3. Secure Customer Onboarding & Profile Management Portal

**Project folder:** [`secure-customer-onboarding-portal/`](./secure-customer-onboarding-portal)

A full-stack customer onboarding portal for profile submission, backend validation, admin review decisions, account status changes and audit-style status history.

### Main Features

- Customer and admin demo login
- Customer profile form with validation
- Account status display
- Admin review queue
- Approve, reject or request review workflow
- Status history for traceability
- Separation between customer actions and admin actions

### Run Locally

```bash
cd secure-customer-onboarding-portal
npm install
npm run dev
```

Frontend: `http://localhost:5175`  
Backend health check: `http://localhost:4200/api/health`

Demo customer:

```text
Email: customer@example.com
Password: demo123
```

Demo admin:

```text
Email: admin@example.com
Password: admin123
```

---

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

- Content marketing coordination
- Social content calendar planning
- Localisation and copy adaptation
- Community monitoring and moderation judgement
- Weekly digital activity reporting
- Digital content strategy
- SEO and generative engine optimisation concepts
- GA4 content measurement planning
- Customer journey and self-service content thinking
- React frontend development
- Node.js and Express API design
- REST APIs
- MySQL schema design
- SQL ledger and reporting query concepts
- JWT/session-style authentication concepts
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