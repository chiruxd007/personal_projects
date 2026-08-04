# Software Engineering Portfolio

A portfolio of Python modelling, information retrieval, natural-language processing, recommendation systems, full-stack SaaS development, relational databases and maintainable software delivery.

## Modelling and Data Projects

### 1. Mineral Prospectivity Baseline

**Project folder:** [`mineral-prospectivity-ml/`](./mineral-prospectivity-ml)

A classical modelling pipeline trained on a reproducible **synthetic, noisy geoscience dataset** inspired by geochemical exploration signals.

- Python, NumPy, Pandas, Matplotlib and scikit-learn
- Missing-value imputation, mixed-feature preprocessing and outlier-aware data generation
- Logistic regression with class balancing and stratified cross-validation
- ROC-AUC, precision, recall and F1 evaluation
- Permutation feature importance and reproducible evaluation plots
- Input validation, CLI output and pytest coverage
- Explicit limitations covering spatial leakage, geological validation and field verification

### 2. Support Ticket Triage Classifier

**Project folder:** [`ai-support-ticket-triage/`](./ai-support-ticket-triage)

A supervised text-classification pipeline that routes support tickets into billing, account-access, technical and transfer queues with confidence scores.

- TF-IDF plus multiclass logistic regression
- Dataset validation and reproducible evaluation
- Human-review friendly confidence output
- CLI predictions, pytest coverage and GitHub Actions

### 3. Menu Recommendation Engine

**Project folder:** [`ai-restaurant-recommender/`](./ai-restaurant-recommender)

A content-based recommendation engine combining natural-language preferences with dietary constraints, spice limits and a controlled inventory signal.

- Semantic menu matching with cosine similarity
- Hard dietary and spice constraints applied before ranking
- Responsible inventory-aware ranking
- Automated tests and documented production extensions

### 4. Resume-to-Job Matching Tool

**Project folder:** [`ai-resume-job-matcher/`](./ai-resume-job-matcher)

An explainable NLP tool that ranks job descriptions against a resume using TF-IDF and cosine similarity, then reports matched and missing technical skills.

- Natural-language preprocessing and bigram features
- Explainable similarity scores and skill-gap analysis
- CLI and JSON output
- Automated pytest coverage

## Retrieval and Search Projects

### 5. Geoscience Document Retrieval Assistant

**Project folder:** [`geoscience-rag-assistant/`](./geoscience-rag-assistant)

A local source-grounded retrieval prototype for a small geoscience knowledge base. It chunks markdown documents, ranks evidence and returns source-cited passages.

- Unstructured document ingestion and chunking
- TF-IDF retrieval with unigram and bigram features
- Cosine-similarity ranking and source-cited evidence
- Weak-evidence fallback behaviour
- Modular Python design, CLI output and automated tests

### Tetress Heuristic Search Solver

A Python state-space search project for an 11x11 toroidal board. It generates legal actions, evaluates candidate states and uses heuristic search with deterministic debugging output.

## Full-Stack SaaS Projects

### FX Multi-Currency Wallet and Currency Conversion Platform

**Project folder:** [`fx-wallet-platform/`](./fx-wallet-platform)

A React, Node.js, Express and MySQL application modelling customer wallets, FX quotes, quote expiry, transfer confirmation, immutable debit/credit ledger entries, transaction history, audit logs and admin reconciliation.

**Key engineering concepts:** REST APIs, JWT authentication, role-based routes, SQL transactions, ledger accounting, validation, auditability, Docker Compose and provider-adapter design.

### FX Operations Dashboard and Reconciliation Tool

**Project folder:** [`fx-operations-dashboard/`](./fx-operations-dashboard)

An internal React and Node.js dashboard for searching transactions, reviewing failed or flagged payments, adding support notes, generating exception summaries and exporting reports.

### Secure Customer Onboarding and Profile Portal

**Project folder:** [`secure-customer-onboarding-portal/`](./secure-customer-onboarding-portal)

A full-stack onboarding workflow with customer/admin authentication, validated profile submission, review decisions, account status transitions and audit-style history.

## Engineering and Experimentation Approach

- Begin with transparent baselines before introducing model complexity
- Validate inputs, document assumptions and expose uncertainty where possible
- Compare results with reproducible metrics rather than demonstrations alone
- Treat synthetic and small portfolio datasets as learning evidence, not production proof
- Build modular Python components with tests and repeatable CLI workflows
- Separate retrieved evidence, model output and human judgement
- Use Git and GitHub Actions to support repeatable delivery

I use ChatGPT for problem decomposition, debugging hypotheses, test planning and documentation, while independently reviewing and testing generated suggestions. See [`docs/ai-assisted-development.md`](./docs/ai-assisted-development.md) for the verification approach.

## Core Skills Demonstrated

- Python, NumPy, Pandas, Matplotlib, scikit-learn and SQL
- Classification, recommendation, information retrieval and heuristic search
- Document chunking, grounding and source attribution
- Data cleaning, missing-value handling, validation and experiment evaluation
- REST APIs, React, Node.js, Express and MySQL
- Authentication, role-based access, audit logging and transaction workflows
- pytest, Jest, GitHub Actions, Git and Docker Compose
- Debugging, modular design, documentation and Agile-style delivery

## Running the Python Projects

Each Python project contains its own `README.md`, `requirements.txt`, sample data or generated inputs, and tests. From a project directory:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
PYTHONPATH=. pytest -q
```

The root GitHub Actions workflow runs all five Python project test suites automatically.

## Author

Chirantan Kundu  
B.Sc. Computer and Software Systems - University of Melbourne
