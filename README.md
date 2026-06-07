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

- Integrate TMDB popular and trending imports.
- Store movie metadata and feedback in SQLite with SQLAlchemy ORM.
- Re-rank recommendations when a user likes, saves, watches, or skips a movie.
- Keep the recommendation engine isolated in `backend/app/recommender`.
- Keep the frontend in TypeScript with typed Axios API contracts.
- Never expose `TMDB_API_KEY` to the frontend.

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

Create `backend/.env` from the example file:

```bash
cp backend/.env.example backend/.env
```

Then add your TMDB Bearer token:

```text
TMDB_API_KEY=your_tmdb_bearer_token
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
- Frontend API: Axios
- Backend: Python, FastAPI, SQLAlchemy, Uvicorn
- Recommendation engine: scikit-learn TF-IDF and cosine similarity
- Database: SQLite
- Data: TMDB popular/trending imports stored locally in SQLite

Later phases can add richer TMDB/OMDb integrations, authentication, a database, MovieLens-style collaborative filtering, weekly scheduled notifications, and embeddings.
