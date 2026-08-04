# Geoscience RAG-Style Retrieval Assistant

A local, source-grounded retrieval prototype for small geoscience knowledge bases. It chunks markdown documents, ranks evidence with TF-IDF and cosine similarity, and returns source-cited passages.

The project demonstrates the retrieval and grounding layer of a RAG system. It does **not** claim to be a production LLM, geoscience authority or autonomous exploration agent.

## What it demonstrates

- Unstructured-document ingestion and chunking
- TF-IDF retrieval with unigram and bigram features
- Evidence ranking and explicit source citations
- Fallback behaviour when evidence is weak
- Modular Python design, CLI output and pytest coverage
- Responsible distinction between retrieved evidence and generated conclusions

## Run

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python assistant.py "Why should spatial leakage be checked?"
```

## Test

```bash
pytest -q
```

## Production extensions

A production RAG system could add embeddings, a vector database, document metadata filters, reranking, an LLM generation layer, prompt-injection controls, offline retrieval evaluation and expert-reviewed answer quality tests.
