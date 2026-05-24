import { useCallback, useEffect, useState } from "react";

import { fetchFeedback, saveFeedback } from "../services/api";
import type { FeedbackAction, FeedbackMap } from "../types";

const storageKey = "movieRecommender.feedback.v1";

export function useFeedback() {
  const [feedback, setFeedback] = useState<FeedbackMap>({});
  const [feedbackRevision, setFeedbackRevision] = useState(0);

  useEffect(() => {
    try {
      setFeedback(JSON.parse(localStorage.getItem(storageKey) || "{}"));
    } catch {
      setFeedback({});
    }

    fetchFeedback()
      .then((payload) => {
        setFeedback(payload.feedback);
        localStorage.setItem(storageKey, JSON.stringify(payload.feedback));
      })
      .catch(() => {
        // Local storage remains a fallback when the API is temporarily unavailable.
      });
  }, []);

  const updateFeedback = useCallback((movieId: string, action: FeedbackAction) => {
    setFeedback((current) => {
      const next = { ...current };
      const nextAction = next[movieId] === action ? undefined : action;

      if (nextAction) {
        next[movieId] = nextAction;
      } else {
        delete next[movieId];
      }

      localStorage.setItem(storageKey, JSON.stringify(next));
      saveFeedback(movieId, nextAction).catch(() => {
        localStorage.setItem(storageKey, JSON.stringify(next));
      });
      setFeedbackRevision((revision) => revision + 1);
      return next;
    });
  }, []);

  return { feedback, feedbackRevision, updateFeedback };
}
