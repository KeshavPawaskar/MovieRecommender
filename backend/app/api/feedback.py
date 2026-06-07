from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.feedback import FeedbackCreate
from app.services.feedback_service import feedback_service

router = APIRouter(prefix="/feedback", tags=["feedback"])


@router.post("")
async def create_feedback(payload: FeedbackCreate, db: Session = Depends(get_db)):
    return feedback_service.create_feedback(db, payload)
