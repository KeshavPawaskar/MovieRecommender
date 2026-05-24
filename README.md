# MovieRecommender

MovieRecommender is a weekend movie picker. It recommends 2-3 movies using a user's country, streaming platforms, favorite genres, runtime preference, and minimum rating.

## Project Structure

```text
MovieRecommender/
  backend/   Python FastAPI API and ML recommendation logic
  frontend/  React app with Material UI components
```

## Phase 1

- Choose country and preferred platforms.
- Choose favorite genres.
- Tune runtime, minimum rating, and "comfort vs surprise".
- Get three weekend picks with poster, title, year, genres, ratings, cast, director, platform availability, and a short non-spoiler summary.
- Mark movies as liked, disliked, watched, or saved for later.

## Phase 2

- Store the movie catalog and feedback in SQLite.
- Sync feedback through the Python backend instead of relying only on browser storage.
- Re-rank recommendations when a user likes, saves, watches, or skips a movie.
- Keep the frontend in TypeScript for safer API and component contracts.
- Keep a TMDB refresh endpoint ready for dynamic catalog imports when `TMDB_API_KEY` is configured.

## Run Locally

Install frontend dependencies once:

```bash
npm install
```

Create the Python backend environment once:

```bash
python3 -m venv backend/.venv
backend/.venv/bin/python -m pip install -r backend/requirements.txt
```

Start the backend:

```bash
npm run dev:backend
```

Start the frontend in another terminal:

```bash
npm run dev --workspace frontend
```

Then open:

```text
http://localhost:5173
```

## Current Stack

- Frontend: React, TypeScript, Vite, Material UI
- Backend: Python, FastAPI, Uvicorn
- Recommendation engine: scikit-learn TF-IDF and cosine similarity
- Database: SQLite
- Data: Seed movie catalog in `backend/src/app/data/seed_movies.py`
- Dynamic data path: optional TMDB weekly trending fetch when `TMDB_API_KEY` is present

Later phases can add richer TMDB/OMDb integrations, authentication, a database, MovieLens-style collaborative filtering, weekly scheduled notifications, and embeddings.
