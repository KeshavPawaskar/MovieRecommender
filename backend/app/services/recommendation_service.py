from sqlalchemy.orm import Session

from app.models.movie import Movie
from app.models.user_feedback import UserFeedback
from app.recommender.content_recommender import content_recommender


class RecommendationService:
    def recommendations(self, db: Session):
        movies = db.query(Movie).all()
        feedback = db.query(UserFeedback).all()
        scored = content_recommender.recommend(movies, feedback)
        return {"recommendations": [content_recommender.to_response(item) for item in scored]}


recommendation_service = RecommendationService()
