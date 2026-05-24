from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from app.services.catalog_service import catalog_service
from app.services.recommendation_service import recommendation_service

app = FastAPI(
    title="MovieRecommender API",
    description="Python ML-backed API for weekend movie recommendations.",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "ok", "engine": "python-fastapi", "recommender": "scikit-learn-tfidf"}


@app.get("/api/options")
async def options():
    movies = await catalog_service.get_movies()
    return catalog_service.get_options(movies)


@app.get("/api/recommendations")
async def recommendations(
    country: str = "IN",
    minimumRating: float = 7.5,
    runtime: str = "any",
    surprise: float = 35,
    platforms: str = Query("Netflix,Prime Video,Disney+ Hotstar"),
    genres: str = Query("Drama,Thriller"),
):
    movies = await catalog_service.get_movies()
    preferences = {
        "country": country,
        "minimumRating": minimumRating,
        "runtime": runtime,
        "surprise": surprise,
        "platforms": parse_csv(platforms),
        "genres": parse_csv(genres),
    }
    return recommendation_service.recommend(movies, preferences)


def parse_csv(value: str):
    return [item.strip() for item in value.split(",") if item.strip()]
