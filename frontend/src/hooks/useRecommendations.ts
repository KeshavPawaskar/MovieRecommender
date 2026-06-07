import { useCallback, useEffect, useState } from "react";

import { getMovies, getRecommendations, syncTmdb } from "../api/movies";
import type { Movie, RecommendationMovie } from "../types/movie";

export function useRecommendations() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [moviePayload, recommendationPayload] = await Promise.all([getMovies(), getRecommendations()]);
      setMovies(moviePayload);
      setRecommendations(recommendationPayload.recommendations);
      setError("");
    } catch {
      setError("Could not load movie data. Check the Python backend and TMDB setup.");
    } finally {
      setLoading(false);
    }
  }, []);

  const importFromTmdb = useCallback(async (importType: "popular" | "trending") => {
    setSyncing(true);
    try {
      await syncTmdb(importType);
      await refresh();
      setError("");
    } catch {
      setError("TMDB sync failed. Confirm TMDB_API_KEY is set in backend/.env.");
    } finally {
      setSyncing(false);
    }
  }, [refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { movies, recommendations, loading, syncing, error, refresh, importFromTmdb };
}
