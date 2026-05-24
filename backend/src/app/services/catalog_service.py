import os
from typing import Dict, List

import httpx

from app.data.seed_movies import SEED_MOVIES


class CatalogService:
    def __init__(self):
        self._cache = None

    async def get_movies(self) -> List[Dict]:
        if self._cache is None:
            self._cache = await self._load_movies()
        return self._cache

    async def _load_movies(self) -> List[Dict]:
        dynamic_movies = await self._load_tmdb_trending()
        merged = {movie["id"]: movie for movie in SEED_MOVIES}

        for movie in dynamic_movies:
            merged[movie["id"]] = movie

        return list(merged.values())

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
                    "genres": ["Trending"],
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
