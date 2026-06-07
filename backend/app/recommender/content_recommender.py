from collections import Counter, defaultdict
from dataclasses import dataclass

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.models.movie import Movie
from app.models.user_feedback import UserFeedback
from app.utils.json import loads
from app.utils.posters import poster_url


@dataclass
class ScoredMovie:
    movie: Movie
    score: float
    reason: str


class ContentRecommender:
    def recommend(self, movies: list[Movie], feedback: list[UserFeedback], limit: int = 12) -> list[ScoredMovie]:
        if not movies:
            return []

        profile_text = self._profile_text(movies, feedback)
        documents = [profile_text] + [self._movie_document(movie) for movie in movies]
        tfidf = TfidfVectorizer(stop_words="english", max_features=4000)
        matrix = tfidf.fit_transform(documents)
        similarities = cosine_similarity(matrix[0:1], matrix[1:]).flatten()

        affinities = self._feedback_affinities(movies, feedback)
        scored = [
            self._score_movie(movie, similarities[index], affinities)
            for index, movie in enumerate(movies)
        ]
        return sorted(scored, key=lambda item: item.score, reverse=True)[:limit]

    def to_response(self, scored_movie: ScoredMovie):
        movie = scored_movie.movie
        return {
            "id": movie.id,
            "tmdb_id": movie.tmdb_id,
            "title": movie.title,
            "overview": movie.overview,
            "genres": loads(movie.genres),
            "poster_path": movie.poster_path,
            "poster_url": poster_url(movie.poster_path),
            "release_year": movie.release_year,
            "vote_average": movie.vote_average,
            "popularity": movie.popularity,
            "actors": loads(movie.actors),
            "director": movie.director,
            "created_at": movie.created_at,
            "score": round(scored_movie.score, 4),
            "reason": scored_movie.reason,
        }

    def _score_movie(self, movie: Movie, similarity_score: float, affinities: dict) -> ScoredMovie:
        genres = loads(movie.genres)
        actors = loads(movie.actors)
        genre_affinity = max([affinities["genres"].get(genre, 0) for genre in genres] or [0])
        actor_affinity = max([affinities["people"].get(person, 0) for person in actors + [movie.director]] or [0])
        popularity_score = min(movie.popularity / 1000, 1)
        penalty = affinities["skipped"].get(movie.id, 0)

        score = (
            similarity_score * 0.7
            + genre_affinity * 0.15
            + actor_affinity * 0.10
            + popularity_score * 0.05
            - penalty
        )
        reason = self._reason(genres, genre_affinity, actor_affinity, popularity_score)
        return ScoredMovie(movie=movie, score=float(score), reason=reason)

    def _movie_document(self, movie: Movie) -> str:
        return " ".join(
            [
                movie.title,
                movie.overview,
                " ".join(loads(movie.genres)),
                " ".join(loads(movie.actors)),
                movie.director,
            ]
        )

    def _profile_text(self, movies: list[Movie], feedback: list[UserFeedback]) -> str:
        movie_by_id = {movie.id: movie for movie in movies}
        positive = {"LIKE", "SAVE", "WATCHED"}
        documents = [
            self._movie_document(movie_by_id[item.movie_id])
            for item in feedback
            if item.feedback_type in positive and item.movie_id in movie_by_id
        ]
        return " ".join(documents) or "popular acclaimed weekend movie drama thriller comedy"

    def _feedback_affinities(self, movies: list[Movie], feedback: list[UserFeedback]):
        movie_by_id = {movie.id: movie for movie in movies}
        genre_counter = Counter()
        people_counter = Counter()
        skipped = defaultdict(float)

        for item in feedback:
            movie = movie_by_id.get(item.movie_id)
            if not movie:
                continue
            if item.feedback_type == "SKIP":
                skipped[item.movie_id] += 0.45
                continue
            weight = 1.0 if item.feedback_type in {"LIKE", "WATCHED"} else 0.7
            for genre in loads(movie.genres):
                genre_counter[genre] += weight
            for person in loads(movie.actors) + [movie.director]:
                if person:
                    people_counter[person] += weight

        return {
            "genres": self._normalize(genre_counter),
            "people": self._normalize(people_counter),
            "skipped": skipped,
        }

    def _normalize(self, counter: Counter):
        if not counter:
            return {}
        max_value = max(counter.values())
        return {key: value / max_value for key, value in counter.items()}

    def _reason(self, genres: list[str], genre_affinity: float, actor_affinity: float, popularity_score: float):
        signals = []
        if genre_affinity > 0:
            signals.append(f"matches your taste for {', '.join(genres[:2])}")
        if actor_affinity > 0:
            signals.append("connects with actors or directors you watched")
        if popularity_score > 0.2:
            signals.append("has strong popularity")
        return "Recommended because it " + ", ".join(signals or ["matches the current movie profile"]) + "."


content_recommender = ContentRecommender()
