from pathlib import Path

from assistant import GeoscienceRetriever, chunk_document, load_chunks


def test_chunking_preserves_source():
    chunks = chunk_document("Copper anomalies may occur near altered rocks.", "notes.md")
    assert chunks[0].source == "notes.md"


def test_retrieval_returns_relevant_grounded_source():
    knowledge = Path(__file__).parents[1] / "data" / "knowledge"
    retriever = GeoscienceRetriever(load_chunks(knowledge))
    results = retriever.retrieve("How can alteration help identify a mineral system?", top_k=2)
    assert results
    assert any("alteration" in result.text.lower() for result in results)
