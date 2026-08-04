# Graduate Full-Stack Developer Portfolio

A software engineering portfolio focused on applied AI, full-stack SaaS development, backend APIs, relational databases, automated testing and maintainable delivery practices.

**Current focus:** Graduate and junior full-stack roles involving AI-assisted development, Agile teamwork, SQL/data modelling and the complete software development lifecycle.

## Featured Applied AI Projects

### 1. AI Support Ticket Triage

**Project folder:** [`ai-support-ticket-triage/`](./ai-support-ticket-triage)

A supervised text-classification pipeline that routes support tickets into billing, account-access, technical and transfer queues with confidence scores.

- TF-IDF plus multiclass logistic regression
- Dataset validation and reproducible evaluation
- Human-review friendly confidence output
- CLI predictions, pytest coverage and GitHub Actions

### 2. AI Restaurant Menu Recommender

**Project folder:** [`ai-restaurant-recommender/`](./ai-restaurant-recommender)

A content-based recommendation engine combining natural-language preferences with dietary constraints, spice limits and a controlled inventory signal.

- Semantic menu matching with cosine similarity
- Hard dietary and spice constraints applied before ranking
- Responsible inventory-aware ranking
- Automated tests and documented production extensions

### 3. AI Resume-to-Job Matcher

**Project folder:** [`ai-resume-job-matcher/`](./ai-resume-job-matcher)

An explainable NLP tool that ranks job descriptions against a resume using TF-IDF and cosine similarity, then reports matched and missing technical skills.

- Natural-language preprocessing and bigram features
- Explainable similarity scores and skill-gap analysis
- CLI and JSON output
- Automated pytest coverage

## Featured Full-Stack SaaS Projects

### 4. FX Multi-Currency Wallet and Currency Conversion Platform

**Project folder:** [`fx-wallet-platform/`](./fx-wallet-platform)

A React, Node.js, Express and MySQL application modelling customer wallets, FX quotes, quote expiry, transfer confirmation, immutable debit/credit ledger entries, transaction history, audit logs and admin reconciliation.

**Key engineering concepts:** REST APIs, JWT authentication, role-based routes, SQL transactions, ledger accounting, validation, auditability, Docker Compose and provider-adapter design.

### 5. FX Operations Dashboard and Reconciliation Tool

**Project folder:** [`fx-operations-dashboard/`](./fx-operations-dashboard)

An internal React and Node.js dashboard for searching transactions, reviewing failed or flagged payments, adding support notes, generating exception summaries and exporting reports.

### 6. Secure Customer Onboarding and Profile Portal

**Project folder:** [`secure-customer-onboarding-portal/`](./secure-customer-onboarding-portal)

A full-stack onboarding workflow with customer/admin authentication, validated profile submission, review decisions, account status transitions and audit-style history.

## Engineering Approach

- Break requirements into small, reviewable development tasks
- Build across frontend, backend, APIs and relational data models
- Use automated testing and manual workflow checks to verify behaviour
- Document setup, assumptions, limitations and design decisions
- Use Git and GitHub Actions to support repeatable delivery
- Communicate blockers early and improve solutions through feedback

I use ChatGPT for problem decomposition, debugging hypotheses, test planning and documentation, while independently reviewing and testing generated suggestions. See [`docs/ai-assisted-development.md`](./docs/ai-assisted-development.md) for the full verification approach.

## Systems and Media Engineering Projects

### C++ Media Metadata Parser

A low-level parser for reading media headers and extracting structured metadata using binary file I/O, byte-level parsing and defensive error handling.

### Custom Memory Allocator

A simplified heap allocator demonstrating manual memory management, free lists, block splitting and block coalescing.

### Multithreaded Thread Pool

A concurrent task-execution project demonstrating worker threads, mutex synchronisation, condition variables and producer-consumer queues.

### Video Frame Processing Pipeline

A staged multithreaded pipeline simulating media-processing workflows and inter-thread communication.

### Mini Image Editor

A lightweight image-processing application with invert, grayscale, brightness, blur and horizontal-flip operations.

## Core Skills Demonstrated

- Python, JavaScript, React, Node.js, Express and C++
- Applied machine learning and natural-language processing
- REST API design and full-stack application development
- MySQL, relational modelling, SQL transactions and reporting queries
- Authentication, validation, role-based access and audit logging
- Automated testing, GitHub Actions and reproducible CLI workflows
- Agile-style task breakdown, debugging and maintainable software design
- Docker-based development, systems programming and concurrency

## Running the AI Projects

Each AI project contains its own `README.md`, `requirements.txt`, sample data and tests. From a project directory:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pytest -q
```

The root GitHub Actions workflow runs all three AI project test suites automatically.

## Author

Chirantan Kundu  
B.Sc. Computer and Software Systems — University of Melbourne
