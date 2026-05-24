from typing import Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.services.catalog_service import catalog_service
from app.services.feedback_service import feedback_service
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


class FeedbackRequest(BaseModel):
    movieId: str
    action: Optional[str] = None
    userId: str = "local-user"


@app.get("/api/health")
def health():
    return {"status": "ok", "engine": "python-fastapi", "recommender": "scikit-learn-tfidf"}


@app.get("/api/options")
async def options():
    movies = await catalog_service.get_movies()
    return catalog_service.get_options(movies)


@app.post("/api/catalog/refresh")
async def refresh_catalog():
    return await catalog_service.refresh_dynamic_movies()


@app.get("/api/feedback")
def get_feedback(userId: str = "local-user"):
    return {"userId": userId, "feedback": feedback_service.get_feedback(userId)}


@app.post("/api/feedback")
def set_feedback(payload: FeedbackRequest):
    try:
        feedback = feedback_service.set_feedback(payload.userId, payload.movieId, payload.action)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    return {"userId": payload.userId, "feedback": feedback}


@app.get("/api/recommendations")
async def recommendations(
    country: str = "IN",
    minimumRating: float = 7.5,
    runtime: str = "any",
    surprise: float = 35,
    platforms: str = Query("Netflix,Prime Video,Disney+ Hotstar"),
    genres: str = Query("Drama,Thriller"),
    userId: str = "local-user",
):
    movies = await catalog_service.get_movies()
    feedback = feedback_service.get_feedback(userId)
    preferences = {
        "country": country,
        "minimumRating": minimumRating,
        "runtime": runtime,
        "surprise": surprise,
        "platforms": parse_csv(platforms),
        "genres": parse_csv(genres),
    }
    return recommendation_service.recommend(movies, preferences, feedback)


def parse_csv(value: str):
    return [item.strip() for item in value.split(",") if item.strip()]
