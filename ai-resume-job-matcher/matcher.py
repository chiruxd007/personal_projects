"""Rank job descriptions against a resume using TF-IDF similarity.

The project is intentionally local and deterministic: no external API keys or
personal data uploads are required.
"""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Iterable

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

SKILLS = {
    "python",
    "java",
    "javascript",
    "typescript",
    "react",
    "node.js",
    "express",
    "sql",
    "mysql",
    "postgresql",
    "aws",
    "docker",
    "git",
    "rest api",
    "machine learning",
    "natural language processing",
    "data structures",
    "algorithms",
    "testing",
    "ci/cd",
}


@dataclass(frozen=True)
class MatchResult:
    job: str
    similarity: float
    matched_skills: list[str]
    missing_skills: list[str]


def normalise(text: str) -> str:
    """Normalise whitespace while preserving useful punctuation."""
    return re.sub(r"\s+", " ", text).strip().lower()


def extract_skills(text: str, vocabulary: Iterable[str] = SKILLS) -> set[str]:
    """Extract known skills using boundary-aware phrase matching."""
    lowered = normalise(text)
    found: set[str] = set()
    for skill in vocabulary:
        pattern = rf"(?<![a-z0-9]){re.escape(skill)}(?![a-z0-9])"
        if re.search(pattern, lowered):
            found.add(skill)
    return found


def rank_jobs(resume_text: str, jobs: dict[str, str]) -> list[MatchResult]:
    """Return job matches ordered from highest to lowest similarity."""
    if not resume_text.strip():
        raise ValueError("Resume text cannot be empty")
    if not jobs:
        raise ValueError("At least one job description is required")

    names = list(jobs)
    documents = [normalise(resume_text), *(normalise(jobs[name]) for name in names)]
    vectorizer = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1, 2),
        sublinear_tf=True,
        min_df=1,
    )
    matrix = vectorizer.fit_transform(documents)
    scores = cosine_similarity(matrix[0:1], matrix[1:]).flatten()

    resume_skills = extract_skills(resume_text)
    results: list[MatchResult] = []
    for name, score in zip(names, scores, strict=True):
        job_skills = extract_skills(jobs[name])
        results.append(
            MatchResult(
                job=name,
                similarity=round(float(score) * 100, 2),
                matched_skills=sorted(resume_skills & job_skills),
                missing_skills=sorted(job_skills - resume_skills),
            )
        )
    return sorted(results, key=lambda result: result.similarity, reverse=True)


def load_jobs(directory: Path) -> dict[str, str]:
    if not directory.is_dir():
        raise FileNotFoundError(f"Job directory not found: {directory}")
    jobs = {
        path.stem.replace("_", " ").title(): path.read_text(encoding="utf-8")
        for path in sorted(directory.glob("*.txt"))
    }
    if not jobs:
        raise ValueError(f"No .txt job descriptions found in {directory}")
    return jobs


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--resume", type=Path, required=True, help="Path to resume text file")
    parser.add_argument("--jobs", type=Path, required=True, help="Directory containing .txt job descriptions")
    parser.add_argument("--json", action="store_true", help="Print machine-readable JSON")
    return parser


def main() -> None:
    args = build_parser().parse_args()
    try:
        resume_text = args.resume.read_text(encoding="utf-8")
        results = rank_jobs(resume_text, load_jobs(args.jobs))
    except (OSError, ValueError) as exc:
        raise SystemExit(f"Error: {exc}") from exc

    if args.json:
        print(json.dumps([asdict(result) for result in results], indent=2))
        return

    for result in results:
        print(f"\n{result.job}: {result.similarity:.2f}% similarity")
        print(f"  Matched skills: {', '.join(result.matched_skills) or 'None'}")
        print(f"  Missing skills: {', '.join(result.missing_skills) or 'None'}")


if __name__ == "__main__":
    main()
