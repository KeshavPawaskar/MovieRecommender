import json
import sqlite3
from pathlib import Path
from typing import Dict, Iterable, List, Optional


class Database:
    def __init__(self):
        self.path = Path(__file__).resolve().parents[3] / "data" / "movie_recommender.db"
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.initialize()

    def connect(self):
        connection = sqlite3.connect(self.path)
        connection.row_factory = sqlite3.Row
        return connection

    def initialize(self):
        with self.connect() as connection:
            connection.executescript(
                """
                CREATE TABLE IF NOT EXISTS movies (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    year INTEGER NOT NULL,
                    genres TEXT NOT NULL,
                    runtime INTEGER NOT NULL,
                    imdb REAL NOT NULL,
                    rotten_tomatoes TEXT NOT NULL,
                    director TEXT NOT NULL,
                    actors TEXT NOT NULL,
                    summary TEXT NOT NULL,
                    poster TEXT NOT NULL,
                    providers TEXT NOT NULL,
                    source TEXT NOT NULL DEFAULT 'seed',
                    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS feedback (
                    user_id TEXT NOT NULL,
                    movie_id TEXT NOT NULL,
                    action TEXT NOT NULL,
                    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (user_id, movie_id)
                );

                CREATE INDEX IF NOT EXISTS idx_feedback_user_action
                    ON feedback (user_id, action);
                """
            )

    def upsert_movies(self, movies: Iterable[Dict], source: str):
        with self.connect() as connection:
            connection.executemany(
                """
                INSERT INTO movies (
                    id, title, year, genres, runtime, imdb, rotten_tomatoes,
                    director, actors, summary, poster, providers, source, updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(id) DO UPDATE SET
                    title = excluded.title,
                    year = excluded.year,
                    genres = excluded.genres,
                    runtime = excluded.runtime,
                    imdb = excluded.imdb,
                    rotten_tomatoes = excluded.rotten_tomatoes,
                    director = excluded.director,
                    actors = excluded.actors,
                    summary = excluded.summary,
                    poster = excluded.poster,
                    providers = excluded.providers,
                    source = excluded.source,
                    updated_at = CURRENT_TIMESTAMP
                """,
                [self._movie_to_row(movie, source) for movie in movies],
            )

    def get_movies(self) -> List[Dict]:
        with self.connect() as connection:
            rows = connection.execute("SELECT * FROM movies ORDER BY title").fetchall()
        return [self._row_to_movie(row) for row in rows]

    def set_feedback(self, user_id: str, movie_id: str, action: Optional[str]):
        with self.connect() as connection:
            if action:
                connection.execute(
                    """
                    INSERT INTO feedback (user_id, movie_id, action, updated_at)
                    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                    ON CONFLICT(user_id, movie_id) DO UPDATE SET
                        action = excluded.action,
                        updated_at = CURRENT_TIMESTAMP
                    """,
                    (user_id, movie_id, action),
                )
            else:
                connection.execute(
                    "DELETE FROM feedback WHERE user_id = ? AND movie_id = ?",
                    (user_id, movie_id),
                )

    def get_feedback(self, user_id: str) -> Dict[str, str]:
        with self.connect() as connection:
            rows = connection.execute(
                "SELECT movie_id, action FROM feedback WHERE user_id = ?",
                (user_id,),
            ).fetchall()
        return {row["movie_id"]: row["action"] for row in rows}

    def _movie_to_row(self, movie: Dict, source: str):
        return (
            movie["id"],
            movie["title"],
            movie["year"],
            json.dumps(movie["genres"]),
            movie["runtime"],
            movie["imdb"],
            movie["rottenTomatoes"],
            movie["director"],
            json.dumps(movie["actors"]),
            movie["summary"],
            movie["poster"],
            json.dumps(movie["providers"]),
            source,
        )

    def _row_to_movie(self, row: sqlite3.Row):
        return {
            "id": row["id"],
            "title": row["title"],
            "year": row["year"],
            "genres": json.loads(row["genres"]),
            "runtime": row["runtime"],
            "imdb": row["imdb"],
            "rottenTomatoes": row["rotten_tomatoes"],
            "director": row["director"],
            "actors": json.loads(row["actors"]),
            "summary": row["summary"],
            "poster": row["poster"],
            "providers": json.loads(row["providers"]),
            "source": row["source"],
        }


database = Database()
