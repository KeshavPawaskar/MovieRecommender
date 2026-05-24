import os
from typing import Dict, List

import httpx

from app.data.seed_movies import SEED_MOVIES
from app.services.database import database


class CatalogService:
    def __init__(self):
        self._cache = None

    async def get_movies(self) -> List[Dict]:
        if self._cache is None:
            self._cache = await self._load_movies()
        return self._cache

    async def _load_movies(self) -> List[Dict]:
        database.upsert_movies(SEED_MOVIES, "seed")
        dynamic_movies = await self._load_tmdb_trending()
        if dynamic_movies:
            database.upsert_movies(dynamic_movies, "tmdb")

        return database.get_movies()

    async def refresh_dynamic_movies(self):
        dynamic_movies = await self._load_tmdb_trending()
        if dynamic_movies:
            database.upsert_movies(dynamic_movies, "tmdb")
            self._cache = database.get_movies()
        return {"imported": len(dynamic_movies), "hasTmdbKey": bool(os.getenv("TMDB_API_KEY"))}

    async def _load_tmdb_trending(self) -> List[Dict]:
        api_key = os.getenv("TMDB_API_KEY")
        if not api_key:
            return []

        url = "https://api.themoviedb.org/3/trending/movie/week"
        headers = {"Authorization": f"Bearer {api_key}"}

        try:
            async with httpx.AsyncClient(timeout=8) as client:
                response = await client.get(url, headers=headers)
                response.raise_for_status()
                payload = response.json()
        except httpx.HTTPError:
            return []

        movies = []
        for item in payload.get("results", [])[:20]:
            movies.append(
                {
                    "id": f"tmdb-{item.get('id')}",
                    "title": item.get("title") or item.get("name") or "Untitled",
                    "year": int((item.get("release_date") or "0000")[:4] or 0),
                    "genres": self._genre_names(item.get("genre_ids", [])),
                    "runtime": 120,
                    "imdb": round(float(item.get("vote_average") or 0), 1),
                    "rottenTomatoes": "N/A",
                    "director": "Unknown",
                    "actors": ["Cast data pending"],
                    "summary": item.get("overview") or "Summary unavailable.",
                    "poster": self._poster_url(item.get("poster_path")),
                    "providers": {
                        "IN": ["Dynamic catalog"],
                        "US": ["Dynamic catalog"],
                        "GB": ["Dynamic catalog"],
                    },
                }
            )

        return movies

    def _genre_names(self, genre_ids):
        tmdb_genres = {
            12: "Adventure",
            14: "Fantasy",
            16: "Animation",
            18: "Drama",
            27: "Horror",
            28: "Action",
            35: "Comedy",
            36: "History",
            37: "Western",
            53: "Thriller",
            80: "Crime",
            99: "Documentary",
            878: "Sci-Fi",
            9648: "Mystery",
            10402: "Music",
            10749: "Romance",
            10751: "Family",
            10752: "War",
            10770: "TV Movie",
        }
        names = [tmdb_genres[genre_id] for genre_id in genre_ids if genre_id in tmdb_genres]
        return names or ["Trending"]

    def _poster_url(self, poster_path):
        if not poster_path:
            return ""
        return f"https://image.tmdb.org/t/p/w780{poster_path}"

    def get_options(self, movies: List[Dict]):
        countries = [
            {"code": "IN", "label": "India"},
            {"code": "US", "label": "United States"},
            {"code": "GB", "label": "United Kingdom"},
        ]
        genres = sorted({genre for movie in movies for genre in movie["genres"]})
        platforms = sorted({provider for movie in movies for providers in movie["providers"].values() for provider in providers})
        return {"countries": countries, "genres": genres, "platforms": platforms}


catalog_service = CatalogService()
