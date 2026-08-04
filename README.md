# Personal Projects Portfolio

A focused software engineering portfolio spanning applied AI, full-stack development, backend APIs, SQL databases, fintech workflows, systems programming, concurrency and media processing.

## Featured AI Projects

### 1. AI Resume-to-Job Matcher

**Project folder:** [`ai-resume-job-matcher/`](./ai-resume-job-matcher)

An explainable NLP tool that ranks job descriptions against a resume using TF-IDF and cosine similarity, then reports matched and missing technical skills.

- Natural-language preprocessing and bigram features
- Explainable similarity scores and skill-gap analysis
- CLI and JSON output
- Automated pytest coverage

### 2. AI Support Ticket Triage

**Project folder:** [`ai-support-ticket-triage/`](./ai-support-ticket-triage)

A supervised text-classification pipeline that routes support tickets into billing, account-access, technical and transfer queues with confidence scores.

- TF-IDF plus multiclass logistic regression
- Dataset validation and reproducible evaluation
- Human-review friendly confidence output
- Automated pytest coverage

### 3. AI Restaurant Menu Recommender

**Project folder:** [`ai-restaurant-recommender/`](./ai-restaurant-recommender)

A content-based recommendation engine that combines natural-language customer preferences with dietary constraints, spice limits and a controlled inventory signal.

- Semantic menu matching with cosine similarity
- Responsible inventory-aware ranking
- Dietary and spice safety constraints
- Automated pytest coverage

## Featured Full-Stack and Fintech Projects

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
- Recommendation systems and text classification
- REST API design and full-stack application development
- MySQL, SQL transactions, ledger concepts and reporting queries
- Authentication, validation, role-based access and audit logging
- Automated testing, GitHub Actions and reproducible CLI workflows
- Docker-based development, debugging and maintainable software design
- Systems programming, memory management and concurrency

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
