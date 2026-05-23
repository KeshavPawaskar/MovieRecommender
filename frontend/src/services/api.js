const defaultPreferences = {
  country: "IN",
  minimumRating: 7.5,
  runtime: "any",
  surprise: 35,
  platforms: ["Netflix", "Prime Video", "Disney+ Hotstar"],
  genres: ["Drama", "Thriller"]
};

function toQueryString(preferences) {
  const params = new URLSearchParams({
    country: preferences.country,
    minimumRating: preferences.minimumRating,
    runtime: preferences.runtime,
    surprise: preferences.surprise,
    platforms: preferences.platforms.join(","),
    genres: preferences.genres.join(",")
  });

  return params.toString();
}

async function request(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export async function fetchOptions() {
  return request("/api/options");
}

export async function fetchRecommendations(preferences) {
  return request(`/api/recommendations?${toQueryString(preferences)}`);
}

export { defaultPreferences };
