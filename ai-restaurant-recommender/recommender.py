"""Content-based menu recommender with inventory-aware ranking."""

from __future__ import annotations

import argparse
import json
from dataclasses import asdict, dataclass
from pathlib import Path

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


@dataclass(frozen=True)
class Recommendation:
    name: str
    score: float
    reason: str


def load_menu(path: Path) -> list[dict]:
    if not path.is_file():
        raise FileNotFoundError(f"Menu file not found: {path}")
    menu = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(menu, list) or not menu:
        raise ValueError("Menu must be a non-empty JSON list")

    required = {"name", "description", "tags", "dietary", "spice", "inventory_boost"}
    for item in menu:
        if not required.issubset(item):
            raise ValueError(f"Menu item is missing required fields: {item}")
    return menu


def item_document(item: dict) -> str:
    return " ".join(
        [
            item["name"],
            item["description"],
            *item["tags"],
            *item["dietary"],
            f"spice {item['spice']}",
        ]
    )


def recommend(
    menu: list[dict],
    preference: str,
    *,
    dietary: str | None = None,
    max_spice: int = 5,
    limit: int = 3,
    inventory_weight: float = 0.12,
) -> list[Recommendation]:
    if not preference.strip():
        raise ValueError("Preference text cannot be empty")
    if not 0 <= max_spice <= 5:
        raise ValueError("max_spice must be between 0 and 5")
    if limit < 1:
        raise ValueError("limit must be at least 1")

    eligible = [
        item
        for item in menu
        if item["spice"] <= max_spice
        and (dietary is None or dietary.lower() in {tag.lower() for tag in item["dietary"]})
    ]
    if not eligible:
        return []

    documents = [preference, *(item_document(item) for item in eligible)]
    matrix = TfidfVectorizer(stop_words="english", ngram_range=(1, 2)).fit_transform(documents)
    semantic_scores = cosine_similarity(matrix[0:1], matrix[1:]).flatten()

    ranked: list[tuple[dict, float, float]] = []
    for item, semantic in zip(eligible, semantic_scores, strict=True):
        inventory = min(max(float(item["inventory_boost"]), 0.0), 1.0)
        final_score = (1 - inventory_weight) * float(semantic) + inventory_weight * inventory
        ranked.append((item, final_score, inventory))

    ranked.sort(key=lambda entry: entry[1], reverse=True)
    recommendations: list[Recommendation] = []
    for item, score, inventory in ranked[:limit]:
        reason = (
            f"Matched {', '.join(item['tags'][:3])}; "
            f"spice {item['spice']}/5; inventory signal {inventory:.2f}."
        )
        recommendations.append(
            Recommendation(name=item["name"], score=round(score * 100, 2), reason=reason)
        )
    return recommendations


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("preference", help="Natural-language craving or preference")
    parser.add_argument("--menu", type=Path, default=Path("data/menu.json"))
    parser.add_argument("--dietary", help="Optional dietary filter, e.g. vegetarian")
    parser.add_argument("--max-spice", type=int, default=5)
    parser.add_argument("--limit", type=int, default=3)
    return parser


def main() -> None:
    args = build_parser().parse_args()
    try:
        results = recommend(
            load_menu(args.menu),
            args.preference,
            dietary=args.dietary,
            max_spice=args.max_spice,
            limit=args.limit,
        )
        print(json.dumps([asdict(result) for result in results], indent=2))
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        raise SystemExit(f"Error: {exc}") from exc


if __name__ == "__main__":
    main()
