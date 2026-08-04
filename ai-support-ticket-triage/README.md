# AI Support Ticket Triage

A supervised NLP classifier that routes support tickets into billing, account-access, technical and transfer queues. The project uses a scikit-learn pipeline so preprocessing and inference remain consistent.

## Engineering Highlights

- TF-IDF word and phrase features
- Multiclass logistic-regression classifier
- Confidence scores for human-review thresholds
- CSV dataset validation and CLI error handling
- Stratified hold-out evaluation
- Automated tests with pytest

## Run

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python triage.py --text "My transfer is still pending"
```

Evaluate on a reproducible hold-out split:

```bash
python triage.py --evaluate
```

## Test

```bash
pytest -q
```

## Interview Talking Points

- Logistic regression is a strong, explainable baseline for small text-classification datasets.
- Confidence can be used to route uncertain predictions to a human rather than automating blindly.
- The pipeline prevents training-serving skew by applying identical text processing at both stages.
- Production improvements could include labelled feedback loops, class-drift monitoring, calibrated probabilities and transformer-based comparisons.
