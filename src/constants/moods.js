import {
  SentimentVerySatisfied,
  SentimentSatisfied,
  SentimentNeutral,
  SentimentDissatisfied,
  Psychology,
} from "@mui/icons-material";

export const availableMoods = ["happy", "good", "neutral", "sad", "stressed"];

export const moodLabels = {
  happy: "Happy",
  good: "Good",
  neutral: "Okay",
  sad: "Low",
  stressed: "Stressed",
};

export const moodIcons = {
  happy: SentimentVerySatisfied,
  good: SentimentSatisfied,
  neutral: SentimentNeutral,
  sad: SentimentDissatisfied,
  stressed: Psychology,
};

export const moodBg = {
  happy: "bg-emerald-50 dark:bg-emerald-900/20",
  good: "bg-sky-50 dark:bg-sky-900/20",
  neutral: "bg-gray-50 dark:bg-gray-800/40",
  sad: "bg-amber-50 dark:bg-amber-900/20",
  stressed: "bg-rose-50 dark:bg-rose-900/20",
};
