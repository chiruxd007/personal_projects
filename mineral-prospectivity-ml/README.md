# Mineral Prospectivity ML Baseline

A portfolio machine-learning project that models mineral prospectivity from a **synthetic, noisy tabular dataset** inspired by geochemical and exploration signals. It demonstrates a responsible baseline workflow rather than claiming geological validity.

## What it demonstrates

- Python, NumPy, Pandas, Matplotlib and scikit-learn
- Missing-value handling and mixed numeric/categorical features
- Reproducible synthetic data generation with noise and outliers
- Stratified cross-validation and ROC-AUC, precision, recall and F1 evaluation
- Class balancing and an interpretable logistic-regression baseline
- Permutation-based feature importance
- Reproducible evaluation and feature-importance plots
- Input validation, CLI output and pytest coverage

## Run

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python prospectivity.py
```

Generate a CSV:

```bash
python prospectivity.py --generate data/geochemical_samples.csv --rows 500
```

Evaluate an input CSV:

```bash
python prospectivity.py --data data/geochemical_samples.csv
```

Create evaluation plots:

```bash
python visualize.py --output-dir reports
```

## Test

```bash
PYTHONPATH=. pytest -q
```

## Example result

The default reproducible synthetic dataset produces approximately 0.86 ROC-AUC. This number measures recovery of the intentionally embedded synthetic signal; it is not evidence of geological performance.

## Limitations

The dataset is synthetic and the model is an educational baseline. It is not suitable for mineral-exploration decisions. A production workflow would require geoscientist-led feature design, spatial validation, leakage controls, calibrated uncertainty, multimodal data and field verification.
