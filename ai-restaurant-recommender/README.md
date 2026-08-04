# AI Restaurant Menu Recommender

A content-based recommendation engine that converts a customer’s natural-language craving into ranked menu suggestions. It combines semantic similarity with dietary filters, spice limits and a bounded inventory signal.

## Engineering Highlights

- TF-IDF content embeddings and cosine similarity
- Natural-language preference matching
- Hard dietary and spice constraints
- Configurable inventory-aware ranking without overriding customer relevance
- Typed recommendation output, JSON CLI and input validation
- Automated tests with pytest

## Run

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python recommender.py "spicy high-protein chicken" --max-spice 4
```

Vegetarian example:

```bash
python recommender.py "fresh and crunchy" --dietary vegetarian
```

## Test

```bash
pytest -q
```

## Interview Talking Points

- Hard constraints are applied before ranking so dietary requirements are never traded away for a higher model score.
- Inventory affects ranking only through a capped weight, reducing the risk of recommending irrelevant items to clear stock.
- The baseline is transparent and works offline; a production version could add user-history embeddings, contextual bandits and A/B-tested ranking objectives.
- The project connects recommendation systems with real restaurant operations and responsible upselling.
