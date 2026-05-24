import { Box, Paper, Stack, Typography } from "@mui/material";

import type { Preferences } from "../types";

function getWeekendLabel() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" });
  const friday = new Date(now);
  friday.setDate(now.getDate() + ((5 - now.getDay() + 7) % 7));
  const sunday = new Date(friday);
  sunday.setDate(friday.getDate() + 2);
  return `${formatter.format(friday)} - ${formatter.format(sunday)}`;
}

type AppHeaderProps = {
  preferences: Preferences;
};

export function AppHeader({ preferences }: AppHeaderProps) {
  const genreLabel = preferences.genres.length ? preferences.genres.slice(0, 2).join(" + ") : "Open to anything";
  const platformLabel = preferences.platforms.length
    ? `Looking on ${preferences.platforms.slice(0, 3).join(", ")}`
    : "Choose a platform to begin";

  return (
    <Box
      component="header"
      sx={{
        minHeight: { xs: 440, md: 330 },
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 360px" },
        alignItems: "end",
        gap: 3.5,
        p: { xs: 2.75, md: 4.25 },
        color: "common.white",
        overflow: "hidden",
        borderRadius: 2,
        boxShadow: "0 16px 40px rgba(24, 26, 31, 0.12)",
        background:
          "linear-gradient(90deg, rgba(13, 22, 28, 0.88), rgba(13, 22, 28, 0.38)), url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80') center / cover"
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="overline" sx={{ fontWeight: 900 }}>
          Weekend watchlist
        </Typography>
        <Typography
          component="h1"
          sx={{
            mt: 0.5,
            mb: 1.5,
            fontSize: { xs: "2.45rem", md: "5.4rem" },
            lineHeight: { xs: 1.04, md: 0.96 },
            fontWeight: 900,
            letterSpacing: 0
          }}
        >
          Movie Recommender
        </Typography>
        <Typography sx={{ maxWidth: 560, color: "rgba(255,255,255,0.86)", fontSize: { xs: "1rem", md: "1.12rem" } }}>
          Pick a mood, country, platforms, and genres. Get three movies worth your weekend.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          minWidth: 0,
          p: 2.5,
          color: "common.white",
          background: "rgba(255, 255, 255, 0.13)",
          border: "1px solid rgba(255,255,255,0.28)",
          backdropFilter: "blur(10px)",
          overflowWrap: "anywhere"
        }}
      >
        <Stack spacing={1}>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.78)" }}>
            {getWeekendLabel()}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            {genreLabel}
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.78)" }}>
            {platformLabel}
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
