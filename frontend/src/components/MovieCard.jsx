import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import { Box, Button, Card, CardContent, CardMedia, Chip, Typography } from "@mui/material";
import { useState } from "react";

const feedbackActions = [
  { value: "liked", label: "Like", icon: <ThumbUpAltOutlinedIcon /> },
  { value: "saved", label: "Save", icon: <BookmarkAddOutlinedIcon /> },
  { value: "watched", label: "Watched", icon: <CheckCircleOutlinedIcon /> },
  { value: "disliked", label: "Skip", icon: <ThumbDownAltOutlinedIcon /> }
];

export function MovieCard({ movie, feedback, onFeedback }) {
  const [posterFailed, setPosterFailed] = useState(false);

  return (
    <Card variant="outlined" sx={{ height: "100%", overflow: "hidden", boxShadow: "0 8px 24px rgba(24, 26, 31, 0.08)" }}>
      <Box sx={{ position: "relative", aspectRatio: "2 / 3", bgcolor: "#20242d" }}>
        {posterFailed ? (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              p: 3,
              color: "rgba(255,255,255,0.78)",
              fontWeight: 900,
              textAlign: "center",
              background: "linear-gradient(135deg, #1f2937, #0f766e)"
            }}
          >
            {movie.title} poster unavailable
          </Box>
        ) : (
          <CardMedia
            component="img"
            image={movie.poster}
            alt={`${movie.title} poster`}
            onError={() => setPosterFailed(true)}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
        <Chip
          label={movie.pickLabel}
          color="primary"
          size="small"
          sx={{ position: "absolute", top: 12, left: 12, color: "common.white", fontWeight: 900 }}
        />
      </Box>

      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 1 }}>
          <Typography variant="h5" component="h3" sx={{ fontWeight: 900 }}>
            {movie.title}
          </Typography>
          <Typography sx={{ color: "text.secondary", fontWeight: 800 }}>{movie.year}</Typography>
        </Box>

        <Typography sx={{ minHeight: 72, mb: 2, color: "#3e434c", lineHeight: 1.5 }}>{movie.summary}</Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1.5 }}>
          {movie.genres.map((genre) => (
            <Chip key={genre} label={genre} />
          ))}
          <Chip label={`${movie.runtime} min`} />
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1.5 }}>
          <Chip color="secondary" variant="outlined" label={`IMDb ${movie.imdb}`} />
          <Chip color="secondary" variant="outlined" label={`Rotten Tomatoes ${movie.rottenTomatoes}`} />
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          <Chip label={`Director: ${movie.director}`} />
          <Chip label={`Cast: ${movie.actors.join(", ")}`} />
        </Box>

        <Box sx={{ p: 1.5, mb: 2, border: "1px solid #cde8e3", borderRadius: 2, bgcolor: "#eef8f6", color: "#164e48", fontWeight: 900 }}>
          Watch on {movie.platformMatches.join(", ")}
        </Box>

        <Typography color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
          {movie.reason}
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {feedbackActions.map((action) => (
            <Button
              key={action.value}
              variant={feedback === action.value ? "contained" : "outlined"}
              color={feedback === action.value ? "secondary" : "inherit"}
              startIcon={action.icon}
              onClick={() => onFeedback(movie.id, action.value)}
              sx={{ flex: "1 1 130px" }}
            >
              {action.label}
            </Button>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
