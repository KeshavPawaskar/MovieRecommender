from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.services.movie_service import movie_service

router = APIRouter(prefix="/tmdb", tags=["tmdb"])


@router.post("/sync")
async def sync_tmdb(
    import_type: str = Query("popular", pattern="^(popular|trending)$"),
    pages: int = Query(1, ge=1, le=5),
    db: Session = Depends(get_db),
):
    return await movie_service.sync_tmdb(db, import_type=import_type, pages=pages)
