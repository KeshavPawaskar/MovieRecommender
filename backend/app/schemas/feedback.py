from enum import Enum

from pydantic import BaseModel


class FeedbackType(str, Enum):
    like = "LIKE"
    save = "SAVE"
    watched = "WATCHED"
    skip = "SKIP"


class FeedbackCreate(BaseModel):
    movie_id: int
    feedback_type: FeedbackType


class FeedbackRead(BaseModel):
    id: int
    movie_id: int
    feedback_type: FeedbackType
