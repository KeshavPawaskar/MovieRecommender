import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import { Box, Button } from "@mui/material";
import type { ReactElement } from "react";

import type { FeedbackType } from "../types/feedback";

const actions: Array<{ type: FeedbackType; label: string; icon: ReactElement }> = [
  { type: "LIKE", label: "Like", icon: <ThumbUpAltOutlinedIcon /> },
  { type: "SAVE", label: "Save", icon: <BookmarkAddOutlinedIcon /> },
  { type: "WATCHED", label: "Watched", icon: <CheckCircleOutlinedIcon /> },
  { type: "SKIP", label: "Skip", icon: <ThumbDownAltOutlinedIcon /> }
];

interface FeedbackButtonsProps {
  disabled: boolean;
  onFeedback: (feedbackType: FeedbackType) => void;
}

export function FeedbackButtons({ disabled, onFeedback }: FeedbackButtonsProps) {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 1 }}>
      {actions.map((action) => (
        <Button
          key={action.type}
          variant="outlined"
          disabled={disabled}
          startIcon={action.icon}
          onClick={() => onFeedback(action.type)}
        >
          {action.label}
        </Button>
      ))}
    </Box>
  );
}
