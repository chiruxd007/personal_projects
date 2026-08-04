"""Grounded geoscience retrieval assistant using local documents.

The project demonstrates document chunking, TF-IDF retrieval, evidence ranking and
source-cited answer assembly. It intentionally avoids presenting a retrieval-only
prototype as a production generative model.
"""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import asdict, dataclass
from pathlib import Path

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


@dataclass(frozen=True)
class Chunk:
    source: str
    text: str


@dataclass(frozen=True)
class RetrievalResult:
    source: str
    score: float
    text: str


def normalise(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def chunk_document(text: str, source: str, max_words: int = 90) -> list[Chunk]:
    if max_words < 20:
        raise ValueError("max_words must be at least 20")
    paragraphs = [normalise(p) for p in re.split(r"\n\s*\n", text) if normalise(p)]
    chunks: list[Chunk] = []
    for paragraph in paragraphs:
        words = paragraph.split()
        for start in range(0, len(words), max_words):
            chunks.append(Chunk(source=source, text=" ".join(words[start : start + max_words])))
    return chunks


def load_chunks(directory: Path) -> list[Chunk]:
    if not directory.exists():
        raise FileNotFoundError(directory)
    chunks: list[Chunk] = []
    for path in sorted(directory.glob("*.md")):
        chunks.extend(chunk_document(path.read_text(encoding="utf-8"), path.name))
    if not chunks:
        raise ValueError("no markdown knowledge files found")
    return chunks


class GeoscienceRetriever:
    def __init__(self, chunks: list[Chunk]) -> None:
        if not chunks:
            raise ValueError("at least one chunk is required")
        self.chunks = chunks
        self.vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
        self.matrix = self.vectorizer.fit_transform(chunk.text for chunk in chunks)

    def retrieve(self, query: str, top_k: int = 3) -> list[RetrievalResult]:
        query = normalise(query)
        if not query:
            raise ValueError("query cannot be empty")
        if top_k < 1:
            raise ValueError("top_k must be positive")
        vector = self.vectorizer.transform([query])
        scores = cosine_similarity(vector, self.matrix)[0]
        ranked = scores.argsort()[::-1][: min(top_k, len(self.chunks))]
        return [
            RetrievalResult(
                source=self.chunks[index].source,
                score=round(float(scores[index]), 4),
                text=self.chunks[index].text,
            )
            for index in ranked
            if scores[index] > 0
        ]

    def answer(self, query: str, top_k: int = 3) -> dict[str, object]:
        evidence = self.retrieve(query, top_k=top_k)
        if not evidence:
            return {
                "answer": "The local knowledge base does not contain enough relevant evidence.",
                "evidence": [],
            }
        statements = [f"[{item.source}] {item.text}" for item in evidence]
        return {
            "answer": "Evidence retrieved from the local knowledge base:\n" + "\n".join(statements),
            "evidence": [asdict(item) for item in evidence],
        }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("query")
    parser.add_argument(
        "--knowledge-dir",
        type=Path,
        default=Path(__file__).parent / "data" / "knowledge",
    )
    parser.add_argument("--top-k", type=int, default=3)
    args = parser.parse_args()
    retriever = GeoscienceRetriever(load_chunks(args.knowledge_dir))
    print(json.dumps(retriever.answer(args.query, top_k=args.top_k), indent=2))


if __name__ == "__main__":
    main()
