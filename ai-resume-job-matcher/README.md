# AI Resume-to-Job Matcher

A local NLP project that ranks job descriptions against a resume using TF-IDF vectors and cosine similarity. It also reports matched and missing technical skills, making the result more explainable than a single score.

## Engineering Highlights

- Natural-language preprocessing and n-gram feature extraction
- Cosine-similarity ranking across multiple job descriptions
- Boundary-aware technical skill extraction
- Typed data models, CLI error handling and JSON output
- Automated tests with pytest
- No external API key or personal-data upload required

## Run

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python matcher.py --resume sample_data/resume.txt --jobs sample_data/jobs
```

Machine-readable output:

```bash
python matcher.py --resume sample_data/resume.txt --jobs sample_data/jobs --json
```

## Test

```bash
pytest -q
```

## Interview Talking Points

- TF-IDF provides a transparent baseline that is fast, deterministic and easy to evaluate.
- Bigram features preserve phrases such as “machine learning” and “data structures”.
- The skill-gap output makes the model actionable instead of returning only a similarity score.
- A production extension could compare this baseline against sentence-transformer embeddings and track ranking quality on labelled recruiter decisions.
