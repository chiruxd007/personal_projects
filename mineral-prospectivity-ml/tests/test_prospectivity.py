from prospectivity import evaluate, generate_synthetic_geology, validate_frame


def test_generated_dataset_contains_noise_and_both_classes():
    frame = generate_synthetic_geology(rows=120, seed=7)
    validate_frame(frame)
    assert frame.isna().sum().sum() > 0
    assert set(frame["mineralised"].unique()) == {0, 1}


def test_model_beats_random_baseline_on_synthetic_signal():
    frame = generate_synthetic_geology(rows=260, seed=11)
    metrics = evaluate(frame, folds=4)
    assert metrics["roc_auc"] > 0.70
    assert metrics["f1"] > 0.50
