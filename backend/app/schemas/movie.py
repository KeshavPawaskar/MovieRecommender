from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict


class MovieBase(BaseModel):
    tmdb_id: int
    title: str
    overview: str
    genres: List[str]
    poster_path: str
    release_year: int
    vote_average: float
    popularity: float
    actors: List[str] = []
    director: str = ""


class MovieRead(MovieBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class RecommendationMovie(MovieRead):
    score: float
    reason: str
    poster_url: Optional[str] = None


class RecommendationResponse(BaseModel):
    recommendations: List[RecommendationMovie]
