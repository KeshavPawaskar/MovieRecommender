export type FeedbackAction = "liked" | "saved" | "watched" | "disliked";

export type FeedbackMap = Record<string, FeedbackAction>;

export type CountryOption = {
  code: string;
  label: string;
};

export type PreferenceOptions = {
  countries: CountryOption[];
  genres: string[];
  platforms: string[];
};

export type Preferences = {
  country: string;
  minimumRating: number;
  runtime: "any" | "short" | "long";
  surprise: number;
  platforms: string[];
  genres: string[];
};

export type Movie = {
  id: string;
  title: string;
  year: number;
  genres: string[];
  runtime: number;
  imdb: number;
  rottenTomatoes: string;
  director: string;
  actors: string[];
  summary: string;
  poster: string;
  platformMatches: string[];
  genreMatches: string[];
  pickLabel: string;
  pickScore: number;
  reason: string;
};

export type RecommendationResponse = {
  preferences: Preferences;
  recommendations: Movie[];
};

export type FeedbackResponse = {
  userId: string;
  feedback: FeedbackMap;
};
