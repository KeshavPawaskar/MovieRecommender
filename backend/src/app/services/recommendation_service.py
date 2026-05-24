from typing import Dict, List

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

PICK_LABELS = ["Best pick", "Comfort pick", "Surprise pick"]


class RecommendationService:
    def recommend(self, movies: List[Dict], preferences: Dict, feedback: Dict = None):
        feedback = feedback or {}
        candidates = [movie for movie in movies if self._passes_filters(movie, preferences)]

        if not candidates:
            return {"preferences": preferences, "recommendations": []}

        movie_text = [self._movie_text(movie) for movie in candidates]
        preference_text = self._preference_text(preferences)
        matrix = TfidfVectorizer(stop_words="english").fit_transform([preference_text] + movie_text)
        similarity_scores = cosine_similarity(matrix[0:1], matrix[1:]).flatten()

        scored = []
        for index, movie in enumerate(candidates):
            platform_matches = self._platform_matches(movie, preferences)
            genre_matches = self._genre_matches(movie, preferences)
            score = self._hybrid_score(
                movie,
                preferences,
                similarity_scores[index],
                platform_matches,
                genre_matches,
                feedback.get(movie["id"]),
                index,
            )

            scored.append(
                {
                    **movie,
                    "pickScore": round(float(score), 2),
                    "availableProviders": movie["providers"].get(preferences["country"], []),
                    "platformMatches": platform_matches,
                    "genreMatches": genre_matches,
                    "reason": self._reason(genre_matches, platform_matches, similarity_scores[index]),
                }
            )

        recommendations = sorted(scored, key=lambda movie: movie["pickScore"], reverse=True)[:3]
        for index, movie in enumerate(recommendations):
            movie["pickLabel"] = PICK_LABELS[index] if index < len(PICK_LABELS) else "Weekend pick"

        return {"preferences": preferences, "recommendations": recommendations}

    def _passes_filters(self, movie: Dict, preferences: Dict) -> bool:
        if movie["imdb"] < preferences["minimumRating"]:
            return False

        if not self._platform_matches(movie, preferences):
            return False

        if preferences["runtime"] == "short" and movie["runtime"] > 120:
            return False

        if preferences["runtime"] == "long" and movie["runtime"] < 120:
            return False

        return True

    def _hybrid_score(self, movie, preferences, similarity, platform_matches, genre_matches, feedback_action, index):
        genre_variety = max(len(movie["genres"]) - len(genre_matches), 0)
        recency_boost = min(max(movie["year"] - 2000, 0), 20) * 0.6
        ml_score = similarity * 100
        quality_score = movie["imdb"] * 10
        genre_score = len(genre_matches) * 18
        platform_score = len(platform_matches) * 7
        surprise_score = preferences["surprise"] * genre_variety * 0.08
        feedback_score = {
            "liked": 22,
            "saved": 14,
            "watched": -35,
            "disliked": -90,
        }.get(feedback_action, 0)
        return quality_score + ml_score + genre_score + platform_score + recency_boost + surprise_score + feedback_score - index * 0.2

    def _movie_text(self, movie: Dict) -> str:
        parts = [
            movie["title"],
            " ".join(movie["genres"]),
            movie["director"],
            " ".join(movie["actors"]),
            movie["summary"],
        ]
        return " ".join(parts)

    def _preference_text(self, preferences: Dict) -> str:
        return " ".join(preferences["genres"] + preferences["platforms"])

    def _platform_matches(self, movie: Dict, preferences: Dict):
        providers = movie["providers"].get(preferences["country"], [])
        return [provider for provider in providers if provider in preferences["platforms"]]

    def _genre_matches(self, movie: Dict, preferences: Dict):
        return [genre for genre in movie["genres"] if genre in preferences["genres"]]

    def _reason(self, genre_matches, platform_matches, similarity):
        genre_text = (
            f"matches your {', '.join(genre_matches)} preference"
            if genre_matches
            else "adds variety outside your usual genres"
        )
        ml_text = "strong text similarity" if similarity >= np.median([similarity, 0.25]) else "a balanced quality score"
        return (
            f"Recommended because it {genre_text}, has {ml_text}, clears your rating filter, "
            f"and is available on {' or '.join(platform_matches)}."
        )


recommendation_service = RecommendationService()
