import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Alert, Box, Button, CircularProgress, Container, Typography } from "@mui/material";

import { RecommendationGrid } from "../components/RecommendationGrid";
import { useMovieFeedback } from "../hooks/useMovieFeedback";
import { useRecommendations } from "../hooks/useRecommendations";

export function HomePage() {
  const { movies, recommendations, loading, syncing, error, refresh, importFromTmdb } = useRecommendations();
  const { pendingMovieId, sendFeedback } = useMovieFeedback(refresh);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Box
        sx={{
          minHeight: 300,
          display: "grid",
          alignItems: "end",
          p: { xs: 3, md: 5 },
          color: "white",
          borderRadius: 2,
          overflow: "hidden",
          background:
            "linear-gradient(90deg, rgba(13, 22, 28, 0.92), rgba(13, 22, 28, 0.45)), url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80') center / cover"
        }}
      >
        <Box>
          <Typography variant="overline" sx={{ fontWeight: 900 }}>Phase 2</Typography>
          <Typography component="h1" sx={{ fontSize: { xs: "2.6rem", md: "5rem" }, lineHeight: 0.98, fontWeight: 900 }}>
            Movie Intelligence
          </Typography>
          <Typography sx={{ mt: 2, maxWidth: 680, color: "rgba(255,255,255,0.82)" }}>
            TMDB catalog sync, SQLite storage, Python recommendation scoring, and feedback-aware re-ranking.
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "center" },
          gap: 2,
          my: 3
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>Recommendations</Typography>
          <Typography color="text.secondary">{movies.length} movies in local catalog</Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5 }}>
          <Button variant="outlined" startIcon={<DownloadOutlinedIcon />} disabled={syncing} onClick={() => importFromTmdb("popular")}>
            Sync Popular
          </Button>
          <Button variant="outlined" startIcon={<DownloadOutlinedIcon />} disabled={syncing} onClick={() => importFromTmdb("trending")}>
            Sync Trending
          </Button>
          <Button variant="contained" startIcon={<RefreshIcon />} onClick={refresh}>
            Refresh
          </Button>
        </Box>
      </Box>

      {error ? <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert> : null}

      {loading ? (
        <Box sx={{ display: "grid", placeItems: "center", minHeight: 280 }}><CircularProgress /></Box>
      ) : recommendations.length ? (
        <RecommendationGrid recommendations={recommendations} pendingMovieId={pendingMovieId} onFeedback={sendFeedback} />
      ) : (
        <Alert severity="info">
          No movies found yet. Add `TMDB_API_KEY` in `backend/.env`, then click Sync Popular or Sync Trending.
        </Alert>
      )}
    </Container>
  );
}
