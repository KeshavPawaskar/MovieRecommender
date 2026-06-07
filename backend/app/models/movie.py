from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base


class Movie(Base):
    __tablename__ = "movies"
    __table_args__ = (UniqueConstraint("tmdb_id", name="uq_movies_tmdb_id"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    tmdb_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    overview: Mapped[str] = mapped_column(Text, nullable=False, default="")
    genres: Mapped[str] = mapped_column(Text, nullable=False, default="[]")
    poster_path: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    release_year: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    vote_average: Mapped[float] = mapped_column(Float, nullable=False, default=0)
    popularity: Mapped[float] = mapped_column(Float, nullable=False, default=0)
    actors: Mapped[str] = mapped_column(Text, nullable=False, default="[]")
    director: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)

    feedback = relationship("UserFeedback", back_populates="movie", cascade="all, delete-orphan")
