import { useCallback, useEffect, useState } from "react";

const storageKey = "movieRecommender.feedback.v1";

export function useFeedback() {
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    try {
      setFeedback(JSON.parse(localStorage.getItem(storageKey)) || {});
    } catch {
      setFeedback({});
    }
  }, []);

  const updateFeedback = useCallback((movieId, action) => {
    setFeedback((current) => {
      const next = { ...current };

      if (next[movieId] === action) {
        delete next[movieId];
      } else {
        next[movieId] = action;
      }

      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  }, []);

  return { feedback, updateFeedback };
}
