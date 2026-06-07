from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.services.movie_service import movie_service

router = APIRouter(prefix="/movies", tags=["movies"])


@router.get("")
async def list_movies(db: Session = Depends(get_db)):
    return movie_service.list_movies(db)


@router.get("/{movie_id}")
async def get_movie(movie_id: int, db: Session = Depends(get_db)):
    movie = movie_service.get_movie(db, movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie
