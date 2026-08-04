from pathlib import Path

from recommender import load_menu, recommend


def test_spicy_chicken_preference_ranks_chicken_item() -> None:
    menu = load_menu(Path("data/menu.json"))
    results = recommend(menu, "I want spicy crispy chicken", max_spice=5)
    assert "Chicken" in results[0].name


def test_dietary_filter_excludes_meat() -> None:
    menu = load_menu(Path("data/menu.json"))
    results = recommend(menu, "something fresh", dietary="vegetarian")
    assert results
    assert all(result.name in {"Garden Crunch Burger", "Mushroom Melt"} for result in results)
