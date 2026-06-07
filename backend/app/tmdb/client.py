import httpx
from typing import Optional

from app.core.config import settings


class TMDBClient:
    base_url = "https://api.themoviedb.org/3"

    def __init__(self):
        self.token = settings.tmdb_api_key

    @property
    def is_configured(self) -> bool:
        return bool(self.token)

    async def get(self, path: str, params: Optional[dict] = None):
        if not self.token:
            raise RuntimeError("TMDB_API_KEY is not configured")

        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.get(
                f"{self.base_url}{path}",
                params=params or {},
                headers={"Authorization": f"Bearer {self.token}", "accept": "application/json"},
            )
            response.raise_for_status()
            return response.json()


tmdb_client = TMDBClient()
