import type { FeedbackAction, FeedbackResponse, PreferenceOptions, Preferences, RecommendationResponse } from "../types";

const defaultPreferences = {
  country: "IN",
  minimumRating: 7.5,
  runtime: "any",
  surprise: 35,
  platforms: ["Netflix", "Prime Video", "Disney+ Hotstar"],
  genres: ["Drama", "Thriller"]
} satisfies Preferences;

const defaultUserId = "local-user";

function toQueryString(preferences: Preferences) {
  const params = new URLSearchParams({
    country: preferences.country,
    minimumRating: String(preferences.minimumRating),
    runtime: preferences.runtime,
    surprise: String(preferences.surprise),
    platforms: preferences.platforms.join(","),
    genres: preferences.genres.join(",")
  });

  return params.toString();
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, options);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export async function fetchOptions() {
  return request<PreferenceOptions>("/api/options");
}

export async function fetchRecommendations(preferences: Preferences) {
  return request<RecommendationResponse>(`/api/recommendations?${toQueryString(preferences)}&userId=${defaultUserId}`);
}

export async function fetchFeedback() {
  return request<FeedbackResponse>(`/api/feedback?userId=${defaultUserId}`);
}

export async function saveFeedback(movieId: string, action?: FeedbackAction) {
  return request<FeedbackResponse>("/api/feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userId: defaultUserId, movieId, action: action ?? null })
  });
}

export { defaultPreferences };
