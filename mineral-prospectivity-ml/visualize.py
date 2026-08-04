"""Create reproducible evaluation plots for the mineral prospectivity baseline."""

from __future__ import annotations

import argparse
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

from prospectivity import evaluate, fit_with_feature_importance, generate_synthetic_geology


def create_plots(output_dir: Path, rows: int = 320) -> list[Path]:
    output_dir.mkdir(parents=True, exist_ok=True)
    frame = generate_synthetic_geology(rows=rows)
    metrics = evaluate(frame)
    _, importance = fit_with_feature_importance(frame)

    metric_path = output_dir / "evaluation_metrics.png"
    fig = plt.figure(figsize=(7, 4))
    names = ["ROC-AUC", "Accuracy", "Precision", "Recall", "F1"]
    values = [metrics["roc_auc"], metrics["accuracy"], metrics["precision"], metrics["recall"], metrics["f1"]]
    plt.bar(names, values)
    plt.ylim(0, 1)
    plt.ylabel("Score")
    plt.title("Cross-validated baseline metrics")
    plt.tight_layout()
    fig.savefig(metric_path, dpi=160)
    plt.close(fig)

    importance_path = output_dir / "feature_importance.png"
    top = importance[:6][::-1]
    fig = plt.figure(figsize=(7, 4))
    plt.barh([item["feature"] for item in top], [item["importance"] for item in top])
    plt.xlabel("Permutation importance (ROC-AUC decrease)")
    plt.title("Held-out feature importance")
    plt.tight_layout()
    fig.savefig(importance_path, dpi=160)
    plt.close(fig)
    return [metric_path, importance_path]


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path, default=Path("reports"))
    parser.add_argument("--rows", type=int, default=320)
    args = parser.parse_args()
    for path in create_plots(args.output_dir, rows=args.rows):
        print(path)


if __name__ == "__main__":
    main()
