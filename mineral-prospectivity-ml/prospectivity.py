"""Mineral prospectivity baseline for noisy tabular geoscience data.

This portfolio project uses a synthetic dataset inspired by common exploration
signals. It demonstrates preprocessing, feature engineering, cross-validation,
model evaluation and explainable feature inspection. It is not a production
geological model and should not be used for exploration decisions.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.inspection import permutation_importance
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, roc_auc_score
from sklearn.model_selection import StratifiedKFold, cross_val_predict, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

NUMERIC_FEATURES = [
    "copper_ppm",
    "zinc_ppm",
    "iron_pct",
    "magnetic_intensity",
    "distance_to_fault_km",
    "alteration_index",
]
CATEGORICAL_FEATURES = ["lithology"]
TARGET = "mineralised"


def generate_synthetic_geology(rows: int = 320, seed: int = 42) -> pd.DataFrame:
    """Generate a reproducible noisy dataset for portfolio experimentation."""
    if rows < 40:
        raise ValueError("rows must be at least 40")

    rng = np.random.default_rng(seed)
    lithologies = rng.choice(
        ["granite", "basalt", "sedimentary", "volcaniclastic"],
        size=rows,
        p=[0.25, 0.25, 0.30, 0.20],
    )
    copper = rng.lognormal(mean=3.6, sigma=0.65, size=rows)
    zinc = rng.lognormal(mean=3.8, sigma=0.55, size=rows)
    iron = np.clip(rng.normal(5.5, 1.8, size=rows), 0.5, None)
    magnetic = rng.normal(110, 30, size=rows)
    fault_distance = np.clip(rng.gamma(2.1, 1.2, size=rows), 0.05, 12)
    alteration = np.clip(rng.beta(2.2, 2.8, size=rows), 0, 1)

    lithology_signal = np.select(
        [lithologies == "volcaniclastic", lithologies == "basalt"],
        [0.75, 0.35],
        default=-0.15,
    )
    latent = (
        0.015 * copper
        + 0.008 * zinc
        + 0.20 * iron
        + 0.012 * magnetic
        - 0.55 * fault_distance
        + 2.4 * alteration
        + lithology_signal
        + rng.normal(0, 1.0, size=rows)
    )
    threshold = np.quantile(latent, 0.72)
    mineralised = (latent >= threshold).astype(int)

    frame = pd.DataFrame(
        {
            "sample_id": [f"S-{i:04d}" for i in range(rows)],
            "copper_ppm": copper.round(2),
            "zinc_ppm": zinc.round(2),
            "iron_pct": iron.round(3),
            "magnetic_intensity": magnetic.round(3),
            "distance_to_fault_km": fault_distance.round(3),
            "alteration_index": alteration.round(4),
            "lithology": lithologies,
            TARGET: mineralised,
        }
    )

    for column in ["copper_ppm", "zinc_ppm", "magnetic_intensity", "alteration_index"]:
        missing_rows = rng.choice(frame.index, size=max(1, rows // 25), replace=False)
        frame.loc[missing_rows, column] = np.nan
    outlier_rows = rng.choice(frame.index, size=max(1, rows // 40), replace=False)
    frame.loc[outlier_rows, "copper_ppm"] *= 6
    return frame


def build_pipeline() -> Pipeline:
    numeric = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )
    categorical = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("encoder", OneHotEncoder(handle_unknown="ignore")),
        ]
    )
    preprocessing = ColumnTransformer(
        transformers=[
            ("numeric", numeric, NUMERIC_FEATURES),
            ("categorical", categorical, CATEGORICAL_FEATURES),
        ]
    )
    classifier = LogisticRegression(max_iter=1500, class_weight="balanced", random_state=42)
    return Pipeline(steps=[("preprocess", preprocessing), ("model", classifier)])


def validate_frame(frame: pd.DataFrame) -> None:
    required = set(NUMERIC_FEATURES + CATEGORICAL_FEATURES + [TARGET])
    missing = sorted(required.difference(frame.columns))
    if missing:
        raise ValueError(f"missing required columns: {', '.join(missing)}")
    labels = set(frame[TARGET].dropna().astype(int).unique())
    if labels != {0, 1}:
        raise ValueError("target must contain both binary classes 0 and 1")


def evaluate(frame: pd.DataFrame, folds: int = 5) -> dict[str, float]:
    validate_frame(frame)
    X = frame[NUMERIC_FEATURES + CATEGORICAL_FEATURES]
    y = frame[TARGET].astype(int)
    cv = StratifiedKFold(n_splits=folds, shuffle=True, random_state=42)
    pipeline = build_pipeline()
    probabilities = cross_val_predict(pipeline, X, y, cv=cv, method="predict_proba")[:, 1]
    predictions = (probabilities >= 0.5).astype(int)
    return {
        "roc_auc": round(float(roc_auc_score(y, probabilities)), 4),
        "accuracy": round(float(accuracy_score(y, predictions)), 4),
        "precision": round(float(precision_score(y, predictions, zero_division=0)), 4),
        "recall": round(float(recall_score(y, predictions, zero_division=0)), 4),
        "f1": round(float(f1_score(y, predictions, zero_division=0)), 4),
    }


def fit_with_feature_importance(frame: pd.DataFrame) -> tuple[Pipeline, list[dict[str, Any]]]:
    validate_frame(frame)
    X = frame[NUMERIC_FEATURES + CATEGORICAL_FEATURES]
    y = frame[TARGET].astype(int)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, stratify=y, random_state=42
    )
    pipeline = build_pipeline().fit(X_train, y_train)
    result = permutation_importance(
        pipeline,
        X_test,
        y_test,
        scoring="roc_auc",
        n_repeats=8,
        random_state=42,
    )
    importance = sorted(
        [
            {"feature": feature, "importance": round(float(score), 5)}
            for feature, score in zip(X.columns, result.importances_mean)
        ],
        key=lambda item: item["importance"],
        reverse=True,
    )
    return pipeline, importance


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", type=Path, help="optional CSV input")
    parser.add_argument("--generate", type=Path, help="write a synthetic CSV and exit")
    parser.add_argument("--rows", type=int, default=320)
    args = parser.parse_args()

    if args.generate:
        frame = generate_synthetic_geology(rows=args.rows)
        args.generate.parent.mkdir(parents=True, exist_ok=True)
        frame.to_csv(args.generate, index=False)
        print(f"wrote {len(frame)} rows to {args.generate}")
        return

    frame = pd.read_csv(args.data) if args.data else generate_synthetic_geology(rows=args.rows)
    metrics = evaluate(frame)
    _, importance = fit_with_feature_importance(frame)
    print(json.dumps({"metrics": metrics, "feature_importance": importance[:6]}, indent=2))


if __name__ == "__main__":
    main()
