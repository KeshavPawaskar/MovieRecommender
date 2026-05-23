# MovieRecommender

MovieRecommender is a weekend movie picker. It recommends 2-3 movies using a user's country, streaming platforms, favorite genres, runtime preference, and minimum rating.

## Project Structure

```text
MovieRecommender/
  backend/   Node.js API and recommendation logic
  frontend/  React app with Material UI components
```

## Phase 1

- Choose country and preferred platforms.
- Choose favorite genres.
- Tune runtime, minimum rating, and "comfort vs surprise".
- Get three weekend picks with poster, title, year, genres, ratings, cast, director, platform availability, and a short non-spoiler summary.
- Mark movies as liked, disliked, watched, or saved for later. Feedback is stored in the browser.

## Run Locally

Install dependencies once:

```bash
npm install
```

Start the backend:

```bash
npm run dev --workspace backend
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
- Backend: Node.js HTTP API
- Data: Seed movie catalog in `backend/src/data/movies.js`

Later phases can add TMDB/OMDb integrations, authentication, a database, weekly scheduled notifications, and a stronger recommendation service.
