from app.tmdb.client import tmdb_client


class TMDBService:
    async def popular_movies(self, page: int = 1):
        return await tmdb_client.get("/movie/popular", {"page": page, "language": "en-US"})

    async def trending_movies(self, time_window: str = "week"):
        return await tmdb_client.get(f"/trending/movie/{time_window}", {"language": "en-US"})

    async def movie_details(self, tmdb_id: int):
        return await tmdb_client.get(f"/movie/{tmdb_id}", {"language": "en-US"})

    async def movie_credits(self, tmdb_id: int):
        return await tmdb_client.get(f"/movie/{tmdb_id}/credits", {"language": "en-US"})


tmdb_service = TMDBService()
