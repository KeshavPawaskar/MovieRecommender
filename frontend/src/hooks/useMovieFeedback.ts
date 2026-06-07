import { useState } from "react";

import { submitFeedback } from "../api/feedback";
import type { FeedbackType } from "../types/feedback";

export function useMovieFeedback(onFeedbackSaved: () => Promise<void>) {
  const [pendingMovieId, setPendingMovieId] = useState<number | null>(null);

  async function sendFeedback(movieId: number, feedbackType: FeedbackType) {
    setPendingMovieId(movieId);
    try {
      await submitFeedback({ movie_id: movieId, feedback_type: feedbackType });
      await onFeedbackSaved();
    } finally {
      setPendingMovieId(null);
    }
  }

  return { pendingMovieId, sendFeedback };
}
