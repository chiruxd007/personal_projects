"""Train and use an explainable support-ticket triage classifier."""

from __future__ import annotations

import argparse
import csv
import json
from dataclasses import asdict, dataclass
from pathlib import Path

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline


@dataclass(frozen=True)
class Prediction:
    category: str
    confidence: float


def load_dataset(path: Path) -> tuple[list[str], list[str]]:
    if not path.is_file():
        raise FileNotFoundError(f"Dataset not found: {path}")

    texts: list[str] = []
    labels: list[str] = []
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        required = {"text", "category"}
        if not required.issubset(reader.fieldnames or []):
            raise ValueError("Dataset must contain text and category columns")
        for row in reader:
            text = row["text"].strip()
            category = row["category"].strip()
            if text and category:
                texts.append(text)
                labels.append(category)

    if len(set(labels)) < 2:
        raise ValueError("Dataset requires at least two categories")
    return texts, labels


def build_model() -> Pipeline:
    return Pipeline(
        steps=[
            (
                "tfidf",
                TfidfVectorizer(
                    lowercase=True,
                    stop_words="english",
                    ngram_range=(1, 2),
                    sublinear_tf=True,
                ),
            ),
            (
                "classifier",
                LogisticRegression(max_iter=1_000, class_weight="balanced", random_state=42),
            ),
        ]
    )


def train_model(texts: list[str], labels: list[str]) -> Pipeline:
    model = build_model()
    model.fit(texts, labels)
    return model


def predict(model: Pipeline, text: str) -> Prediction:
    if not text.strip():
        raise ValueError("Ticket text cannot be empty")
    probabilities = model.predict_proba([text])[0]
    index = int(probabilities.argmax())
    categories = model.named_steps["classifier"].classes_
    return Prediction(category=str(categories[index]), confidence=round(float(probabilities[index]), 4))


def evaluate(texts: list[str], labels: list[str]) -> str:
    train_x, test_x, train_y, test_y = train_test_split(
        texts,
        labels,
        test_size=0.3,
        random_state=42,
        stratify=labels,
    )
    model = train_model(train_x, train_y)
    predictions = model.predict(test_x)
    return classification_report(test_y, predictions, zero_division=0)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", type=Path, default=Path("data/tickets.csv"))
    parser.add_argument("--text", help="Classify one support ticket")
    parser.add_argument("--evaluate", action="store_true", help="Print a hold-out evaluation")
    return parser


def main() -> None:
    args = build_parser().parse_args()
    try:
        texts, labels = load_dataset(args.data)
        if args.evaluate:
            print(evaluate(texts, labels))
            return
        if not args.text:
            raise ValueError("Provide --text or use --evaluate")
        result = predict(train_model(texts, labels), args.text)
        print(json.dumps(asdict(result), indent=2))
    except (OSError, ValueError) as exc:
        raise SystemExit(f"Error: {exc}") from exc


if __name__ == "__main__":
    main()
