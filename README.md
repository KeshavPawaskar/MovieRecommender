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
- Mark movies as liked, disliked, watched, or saved for later. Feedback is stored in the browser.

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

- Frontend: React, Vite, Material UI
- Backend: Python, FastAPI, Uvicorn
- Recommendation engine: scikit-learn TF-IDF and cosine similarity
- Data: Seed movie catalog in `backend/src/app/data/seed_movies.py`
- Dynamic data path: optional TMDB weekly trending fetch when `TMDB_API_KEY` is present

Later phases can add richer TMDB/OMDb integrations, authentication, a database, MovieLens-style collaborative filtering, weekly scheduled notifications, and embeddings.
