from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.services.recommendation_service import recommendation_service

router = APIRouter(prefix="/recommendations", tags=["recommendations"])


@router.get("")
async def recommendations(db: Session = Depends(get_db)):
    return recommendation_service.recommendations(db)
