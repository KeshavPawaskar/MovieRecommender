import { apiClient } from "./client";
import type { FeedbackRequest } from "../types/feedback";

export async function submitFeedback(payload: FeedbackRequest) {
  const response = await apiClient.post("/feedback", payload);
  return response.data;
}
