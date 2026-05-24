import RefreshIcon from "@mui/icons-material/Refresh";
import { Alert, Box, Button, CircularProgress, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { AppHeader } from "./components/AppHeader";
import { MovieCard } from "./components/MovieCard";
import { PreferencePanel } from "./components/PreferencePanel";
import { useFeedback } from "./hooks/useFeedback";
import { defaultPreferences, fetchOptions, fetchRecommendations } from "./services/api";
import type { Movie, PreferenceOptions, Preferences } from "./types";

export default function App() {
  const [options, setOptions] = useState<PreferenceOptions | null>(null);
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { feedback, feedbackRevision, updateFeedback } = useFeedback();

  useEffect(() => {
    fetchOptions()
      .then(setOptions)
      .catch(() => setError("Could not load preference options from the backend."));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchRecommendations(preferences)
      .then((payload) => {
        setRecommendations(payload.recommendations);
        setError("");
      })
      .catch(() => setError("Could not load recommendations from the backend."))
      .finally(() => setLoading(false));
  }, [preferences, feedbackRevision]);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 1.25, md: 4 } }}>
      <AppHeader preferences={preferences} />

      {error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : null}

      <PreferencePanel options={options} preferences={preferences} onPreferenceChange={setPreferences} />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "flex-end" },
          gap: 2,
          mb: 2.25
        }}
      >
        <Box>
          <Typography variant="overline" color="secondary" sx={{ fontWeight: 900 }}>
            Phase 1 picks
          </Typography>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 900, letterSpacing: 0, fontSize: { xs: "2rem", md: "2.8rem" } }}>
            Your weekend movies
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={() => setPreferences((current) => ({ ...current, surprise: Math.min(100, current.surprise + 5) }))}
        >
          Refresh picks
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "grid", placeItems: "center", minHeight: 260 }}>
          <CircularProgress />
        </Box>
      ) : recommendations.length ? (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" }, gap: 2.25 }}>
          {recommendations.map((movie) => (
            <Box key={movie.id}>
              <MovieCard movie={movie} feedback={feedback[movie.id]} onFeedback={updateFeedback} />
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ p: 4, bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 2, textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            No matches yet
          </Typography>
          <Typography color="text.secondary">Try lowering the rating, choosing more genres, or adding another platform.</Typography>
        </Box>
      )}
    </Container>
  );
}
