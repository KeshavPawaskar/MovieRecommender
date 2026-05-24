from typing import Optional

from app.services.database import database

VALID_ACTIONS = {"liked", "saved", "watched", "disliked"}


class FeedbackService:
    def get_feedback(self, user_id: str):
        return database.get_feedback(user_id)

    def set_feedback(self, user_id: str, movie_id: str, action: Optional[str]):
        if action and action not in VALID_ACTIONS:
            raise ValueError(f"Unsupported feedback action: {action}")
        database.set_feedback(user_id, movie_id, action)
        return database.get_feedback(user_id)


feedback_service = FeedbackService()
