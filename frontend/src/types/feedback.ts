export type FeedbackType = "LIKE" | "SAVE" | "WATCHED" | "SKIP";

export interface FeedbackRequest {
  movie_id: number;
  feedback_type: FeedbackType;
}
