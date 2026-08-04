from pathlib import Path

from triage import load_dataset, predict, train_model


def test_classifier_returns_valid_confidence() -> None:
    texts, labels = load_dataset(Path("data/tickets.csv"))
    result = predict(train_model(texts, labels), "My password reset code is not arriving")
    assert result.category == "account_access"
    assert 0.0 <= result.confidence <= 1.0


def test_empty_ticket_is_rejected() -> None:
    texts, labels = load_dataset(Path("data/tickets.csv"))
    model = train_model(texts, labels)
    try:
        predict(model, "   ")
    except ValueError as exc:
        assert "empty" in str(exc).lower()
    else:
        raise AssertionError("Expected ValueError")
