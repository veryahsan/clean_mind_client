import React, { useState, useEffect } from "react";
import moodApi from "../../services/moodApi";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";

// Emoji mapping for moods
const moodEmojis = {
  very_happy: "😄",
  happy: "😊",
  content: "🙂",
  neutral: "😐",
  anxious: "😰",
  sad: "😢",
  annoyed: "😒",
  angry: "😠",
  stressed: "😫",
  excited: "🤩",
  calm: "😌",
  tired: "😴",
};

// Mood labels
const moodLabels = {
  very_happy: "Very Happy",
  happy: "Happy",
  content: "Content",
  neutral: "Neutral",
  anxious: "Anxious",
  sad: "Sad",
  annoyed: "Annoyed",
  angry: "Angry",
  stressed: "Stressed",
  excited: "Excited",
  calm: "Calm",
  tired: "Tired",
};

const availableMoods = [
  "very_happy",
  "happy",
  "content",
  "neutral",
  "anxious",
  "sad",
  "annoyed",
  "angry",
  "stressed",
  "excited",
  "calm",
  "tired",
];

const MoodTracker = () => {
  const [todayMood, setTodayMood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    fetchTodayMood();
  }, []);

  const fetchTodayMood = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await moodApi.get("today/");
      const responseData = response.data;

      if (responseData.success) {
        if (responseData.data.has_mood) {
          setTodayMood(responseData.data);
        } else {
          setTodayMood(null);
        }
      }
    } catch (err) {
      console.error("Failed to fetch today's mood:", err);
      const errorData = err.response?.data;
      setError(
        errorData?.message || "Failed to load your mood. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelect = async (moodType) => {
    try {
      setSubmitting(true);
      setError("");
      const response = await moodApi.post("", {
        mood_type: moodType,
      });

      const responseData = response.data;
      if (responseData.success) {
        setTodayMood(responseData.data);
        setShowUpdate(false);
      }
    } catch (err) {
      console.error("Failed to submit mood:", err);
      const errorData = err.response?.data;
      setError(
        errorData?.message || "Failed to save your mood. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateMood = async (moodType) => {
    if (!todayMood?.id) {
      setError("Mood ID not found. Please refresh the page.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      
      const response = await moodApi.patch(`${todayMood.id}/`, {
        mood_type: moodType,
      });

      const responseData = response.data;
      
      if (responseData.success) {
        // Update returns today's mood structure from get_today_mood
        // Response structure: { success: true, data: { has_mood: true, id: ..., mood_type: ..., ... } }
        if (responseData.data && responseData.data.has_mood) {
          setTodayMood(responseData.data);
        } else {
          // Refresh from server to get latest data
          await fetchTodayMood();
        }
        setShowUpdate(false);
      } else {
        setError(responseData.message || "Failed to update mood.");
      }
    } catch (err) {
      console.error("Failed to update mood:", err);
      const errorData = err.response?.data;
      
      if (errorData) {
        setError(errorData.message || "Failed to update your mood. Please try again.");
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader fullScreen={false} size={40} />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Main Heading - Compact */}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
        How Are You Feeling Today?
      </h2>

      <ErrorMessage message={error} />

      {/* Show Current Mood or Selection UI */}
      {todayMood ? (
        <div>
          {/* Current Mood Display - Compact */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-3 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{moodEmojis[todayMood.mood_type]}</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {moodLabels[todayMood.mood_type]}
                </h3>
                {todayMood.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {todayMood.notes}
                  </p>
                )}
              </div>
            </div>
            {!showUpdate && (
              <button
                onClick={() => setShowUpdate(true)}
                disabled={submitting}
                className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Change
              </button>
            )}
          </div>

          {/* Mood Selection (for update) - Compact */}
          {showUpdate && (
            <div className="mt-3">
              <MoodSelectionGrid
                moods={availableMoods}
                onSelect={handleUpdateMood}
                submitting={submitting}
                compact={true}
              />
              <div className="text-center mt-2">
                <button
                  onClick={() => setShowUpdate(false)}
                  disabled={submitting}
                  className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <MoodSelectionGrid
            moods={availableMoods}
            onSelect={handleMoodSelect}
            submitting={submitting}
            compact={true}
          />
        </div>
      )}
    </div>
  );
};

// Mood Selection Grid Component
const MoodSelectionGrid = ({ moods, onSelect, submitting, compact = false }) => {
  if (compact) {
    return (
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
        {moods.map((moodType) => (
          <button
            key={moodType}
            onClick={() => onSelect(moodType)}
            disabled={submitting}
            className="group relative bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            title={moodLabels[moodType]}
          >
            <div className="text-center">
              <div className="text-2xl mb-1 group-hover:scale-110 transition-transform duration-200">
                {moodEmojis[moodType]}
              </div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                {moodLabels[moodType]}
              </p>
            </div>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {moods.map((moodType) => (
        <button
          key={moodType}
          onClick={() => onSelect(moodType)}
          disabled={submitting}
          className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-200 shadow-md hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <div className="text-center">
            <div className="text-5xl mb-2 group-hover:scale-110 transition-transform duration-200">
              {moodEmojis[moodType]}
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {moodLabels[moodType]}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default MoodTracker;

