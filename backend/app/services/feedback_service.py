from sqlalchemy.orm import Session

from app.models.user_feedback import UserFeedback
from app.schemas.feedback import FeedbackCreate


class FeedbackService:
    def create_feedback(self, db: Session, payload: FeedbackCreate):
        feedback = UserFeedback(movie_id=payload.movie_id, feedback_type=payload.feedback_type.value)
        db.add(feedback)
        db.commit()
        db.refresh(feedback)
        return feedback

    def list_feedback(self, db: Session):
        return db.query(UserFeedback).order_by(UserFeedback.created_at.desc()).all()


feedback_service = FeedbackService()
