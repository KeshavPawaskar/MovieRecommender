const { movies } = require("../data/movies");

const pickLabels = ["Best pick", "Comfort pick", "Surprise pick"];

function parseList(value, fallback = []) {
  if (!value) return fallback;
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getOptions() {
  const countries = [
    { code: "IN", label: "India" },
    { code: "US", label: "United States" },
    { code: "GB", label: "United Kingdom" }
  ];

  const genres = [...new Set(movies.flatMap((movie) => movie.genres))].sort();
  const platforms = [...new Set(movies.flatMap((movie) => Object.values(movie.providers).flat()))].sort();

  return { countries, genres, platforms };
}

function buildPreferences(query) {
  return {
    country: query.country || "IN",
    minimumRating: Number(query.minimumRating || 7.5),
    runtime: query.runtime || "any",
    surprise: Number(query.surprise || 35),
    platforms: parseList(query.platforms, ["Netflix", "Prime Video", "Disney+ Hotstar"]),
    genres: parseList(query.genres, ["Drama", "Thriller"])
  };
}

function scoreMovie(movie, preferences, index) {
  const availableProviders = movie.providers[preferences.country] || [];
  const platformMatches = availableProviders.filter((provider) => preferences.platforms.includes(provider));
  const genreMatches = movie.genres.filter((genre) => preferences.genres.includes(genre));

  if (!platformMatches.length || movie.imdb < preferences.minimumRating) {
    return null;
  }

  if (preferences.runtime === "short" && movie.runtime > 120) {
    return null;
  }

  if (preferences.runtime === "long" && movie.runtime < 120) {
    return null;
  }

  const genreVariety = movie.genres.length - genreMatches.length;
  const recencyBoost = Math.min(Math.max(movie.year - 2000, 0), 20) * 0.6;
  const score =
    movie.imdb * 10 +
    genreMatches.length * 18 +
    platformMatches.length * 7 +
    recencyBoost +
    preferences.surprise * genreVariety * 0.08 -
    index * 0.2;

  return {
    ...movie,
    pickScore: Number(score.toFixed(2)),
    availableProviders,
    platformMatches,
    genreMatches,
    reason: buildReason(genreMatches, platformMatches)
  };
}

function buildReason(genreMatches, platformMatches) {
  const genreText = genreMatches.length
    ? `matches your ${genreMatches.join(", ")} preference`
    : "adds variety outside your usual genres";
  return `Recommended because it ${genreText}, clears your rating filter, and is available on ${platformMatches.join(" or ")}.`;
}

function getRecommendations(query) {
  const preferences = buildPreferences(query);
  const recommendations = movies
    .map((movie, index) => scoreMovie(movie, preferences, index))
    .filter(Boolean)
    .sort((a, b) => b.pickScore - a.pickScore)
    .slice(0, 3)
    .map((movie, index) => ({
      ...movie,
      pickLabel: pickLabels[index] || "Weekend pick"
    }));

  return { preferences, recommendations };
}

module.exports = {
  getOptions,
  getRecommendations
};
