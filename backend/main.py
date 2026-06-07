from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.feedback import router as feedback_router
from app.api.movies import router as movies_router
from app.api.recommendations import router as recommendations_router
from app.api.tmdb import router as tmdb_router
from app.database.session import init_db

app = FastAPI(
    title="MovieRecommender API",
    description="TMDB-backed movie recommendation API with content-based ML scoring.",
    version="0.3.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    init_db()


@app.get("/health")
def health():
    return {"status": "ok", "engine": "fastapi-sqlalchemy", "recommender": "tfidf-cosine"}


app.include_router(movies_router)
app.include_router(recommendations_router)
app.include_router(feedback_router)
app.include_router(tmdb_router)
