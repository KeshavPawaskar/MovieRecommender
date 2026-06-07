export interface Movie {
  id: number;
  tmdb_id: number;
  title: string;
  overview: string;
  genres: string[];
  poster_path: string;
  poster_url?: string;
  release_year: number;
  vote_average: number;
  popularity: number;
  actors: string[];
  director: string;
  created_at: string;
}

export interface RecommendationMovie extends Movie {
  score: number;
  reason: string;
}

export interface RecommendationResponse {
  recommendations: RecommendationMovie[];
}
