import { Box } from "@mui/material";

import type { FeedbackType } from "../types/feedback";
import type { RecommendationMovie } from "../types/movie";
import { MovieCard } from "./MovieCard";

interface RecommendationGridProps {
  recommendations: RecommendationMovie[];
  pendingMovieId: number | null;
  onFeedback: (movieId: number, feedbackType: FeedbackType) => void;
}

export function RecommendationGrid({ recommendations, pendingMovieId, onFeedback }: RecommendationGridProps) {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" }, gap: 2.25 }}>
      {recommendations.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          feedbackPending={pendingMovieId === movie.id}
          onFeedback={onFeedback}
        />
      ))}
    </Box>
  );
}
