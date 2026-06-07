import { Box, Card, CardContent, CardMedia, Chip, Typography } from "@mui/material";

import type { FeedbackType } from "../types/feedback";
import type { RecommendationMovie } from "../types/movie";
import { FeedbackButtons } from "./FeedbackButtons";

interface MovieCardProps {
  movie: RecommendationMovie;
  feedbackPending: boolean;
  onFeedback: (movieId: number, feedbackType: FeedbackType) => void;
}

export function MovieCard({ movie, feedbackPending, onFeedback }: MovieCardProps) {
  return (
    <Card variant="outlined" sx={{ height: "100%", overflow: "hidden", boxShadow: "0 8px 24px rgba(24, 26, 31, 0.08)" }}>
      <Box sx={{ aspectRatio: "2 / 3", bgcolor: "#111827", position: "relative" }}>
        {movie.poster_url ? (
          <CardMedia component="img" image={movie.poster_url} alt={`${movie.title} poster`} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Box sx={{ display: "grid", placeItems: "center", height: "100%", color: "white", p: 3, textAlign: "center" }}>
            Poster unavailable
          </Box>
        )}
        <Chip label={`Score ${movie.score.toFixed(2)}`} color="primary" size="small" sx={{ position: "absolute", top: 12, left: 12, color: "white", fontWeight: 900 }} />
      </Box>
      <CardContent>
        <Typography variant="h5" component="h3" sx={{ fontWeight: 900 }}>
          {movie.title} <Typography component="span" color="text.secondary">({movie.release_year || "N/A"})</Typography>
        </Typography>
        <Typography sx={{ mt: 1.5, mb: 2, color: "text.secondary", lineHeight: 1.55 }}>{movie.overview || "Overview unavailable."}</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {movie.genres.map((genre) => <Chip key={genre} label={genre} />)}
          <Chip label={`TMDB ${movie.vote_average.toFixed(1)}`} color="secondary" variant="outlined" />
        </Box>
        <Typography variant="body2" sx={{ mb: 1 }}><strong>Director:</strong> {movie.director || "Unknown"}</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}><strong>Cast:</strong> {movie.actors.slice(0, 3).join(", ") || "Unknown"}</Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>{movie.reason}</Typography>
        <FeedbackButtons disabled={feedbackPending} onFeedback={(feedbackType) => onFeedback(movie.id, feedbackType)} />
      </CardContent>
    </Card>
  );
}
