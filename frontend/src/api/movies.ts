import { apiClient } from "./client";
import type { Movie, RecommendationResponse } from "../types/movie";

export async function getMovies(): Promise<Movie[]> {
  const response = await apiClient.get<Movie[]>("/movies");
  return response.data;
}

export async function getMovie(id: number): Promise<Movie> {
  const response = await apiClient.get<Movie>(`/movies/${id}`);
  return response.data;
}

export async function getRecommendations(): Promise<RecommendationResponse> {
  const response = await apiClient.get<RecommendationResponse>("/recommendations");
  return response.data;
}

export async function syncTmdb(importType: "popular" | "trending" = "popular") {
  const response = await apiClient.post("/tmdb/sync", null, {
    params: { import_type: importType, pages: 1 }
  });
  return response.data;
}
