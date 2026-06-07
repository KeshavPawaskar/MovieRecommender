from sqlalchemy.orm import Session

from app.models.movie import Movie
from app.schemas.movie import MovieRead
from app.tmdb.client import tmdb_client
from app.tmdb.service import tmdb_service
from app.utils.json import dumps, loads


class MovieService:
    def list_movies(self, db: Session):
        return [self.to_schema(movie) for movie in db.query(Movie).order_by(Movie.popularity.desc()).all()]

    def get_movie(self, db: Session, movie_id: int):
        movie = db.get(Movie, movie_id)
        return self.to_schema(movie) if movie else None

    async def sync_tmdb(self, db: Session, import_type: str = "popular", pages: int = 1):
        if not tmdb_client.is_configured:
            return {"imported": 0, "updated": 0, "skipped": 0, "configured": False}

        imported = 0
        updated = 0
        seen_ids: set[int] = set()

        for page in range(1, pages + 1):
            payload = await self._list_payload(import_type, page)
            for item in payload.get("results", []):
                tmdb_id = item.get("id")
                if not tmdb_id or tmdb_id in seen_ids:
                    continue
                seen_ids.add(tmdb_id)

                movie_payload = await self._movie_payload(tmdb_id, item)
                exists = db.query(Movie).filter(Movie.tmdb_id == tmdb_id).one_or_none()
                if exists:
                    self._apply_movie_payload(exists, movie_payload)
                    updated += 1
                else:
                    db.add(Movie(**movie_payload))
                    imported += 1

        db.commit()
        return {"imported": imported, "updated": updated, "skipped": 0, "configured": True}

    async def _list_payload(self, import_type: str, page: int):
        if import_type == "trending":
            return await tmdb_service.trending_movies()
        return await tmdb_service.popular_movies(page)

    async def _movie_payload(self, tmdb_id: int, fallback: dict):
        details = await tmdb_service.movie_details(tmdb_id)
        credits = await tmdb_service.movie_credits(tmdb_id)
        crew = credits.get("crew", [])
        cast = credits.get("cast", [])
        director = next((person.get("name") for person in crew if person.get("job") == "Director"), "")
        actors = [person.get("name") for person in cast[:5] if person.get("name")]
        release_date = details.get("release_date") or fallback.get("release_date") or ""

        return {
            "tmdb_id": tmdb_id,
            "title": details.get("title") or fallback.get("title") or "Untitled",
            "overview": details.get("overview") or fallback.get("overview") or "",
            "genres": dumps([genre.get("name") for genre in details.get("genres", []) if genre.get("name")]),
            "poster_path": details.get("poster_path") or fallback.get("poster_path") or "",
            "release_year": int(release_date[:4]) if release_date[:4].isdigit() else 0,
            "vote_average": float(details.get("vote_average") or fallback.get("vote_average") or 0),
            "popularity": float(details.get("popularity") or fallback.get("popularity") or 0),
            "actors": dumps(actors),
            "director": director or "",
        }

    def _apply_movie_payload(self, movie: Movie, payload: dict):
        for key, value in payload.items():
            setattr(movie, key, value)

    def to_schema(self, movie: Movie):
        return MovieRead(
            id=movie.id,
            tmdb_id=movie.tmdb_id,
            title=movie.title,
            overview=movie.overview,
            genres=loads(movie.genres),
            poster_path=movie.poster_path,
            release_year=movie.release_year,
            vote_average=movie.vote_average,
            popularity=movie.popularity,
            actors=loads(movie.actors),
            director=movie.director,
            created_at=movie.created_at,
        )


movie_service = MovieService()
