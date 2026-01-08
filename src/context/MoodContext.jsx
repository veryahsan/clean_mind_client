/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import moodApi from "../services/moodApi";
import { useAuth } from "./AuthContext";

export const MoodContext = createContext(null);

export const MoodProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [todayMood, setTodayMood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch today's mood
  const fetchTodayMood = useCallback(async () => {
    if (!isAuthenticated) {
      setTodayMood(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await moodApi.get("today/");
      const data = response.data;

      if (data?.success && data.data?.has_mood) {
        setTodayMood(data.data);
      } else {
        setTodayMood(null);
      }
    } catch (err) {
      console.error("Failed to fetch today's mood:", err);
      const errorData = err.response?.data;
      setError(errorData?.message || "Failed to load your mood. Please try again.");
      setTodayMood(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Submit or create mood
  const submitMood = async (moodType, notes = null) => {
    try {
      setSubmitting(true);
      setError("");
      const response = await moodApi.post("", {
        mood_type: moodType,
        ...(notes && { notes }),
      });
      const data = response.data;

      if (data?.success) {
        // Refresh today's mood after submission
        await fetchTodayMood();
        return { success: true, data: data.data };
      } else {
        setError(data?.message || "Failed to save your mood.");
        return { success: false, error: data?.message || "Failed to save your mood." };
      }
    } catch (err) {
      console.error("Failed to submit mood:", err);
      const errorData = err.response?.data;
      const errorMessage = errorData?.message || "Failed to save your mood. Please try again.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  };

  // Update existing mood
  const updateMood = async (moodType, notes = null) => {
    if (!todayMood?.id) {
      const errorMessage = "Mood ID not found. Please refresh the page.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }

    try {
      setSubmitting(true);
      setError("");

      const updateData = { mood_type: moodType };
      if (notes !== null) {
        updateData.notes = notes;
      }

      const response = await moodApi.patch(`${todayMood.id}/`, updateData);
      const data = response.data;

      if (data?.success) {
        // Refresh today's mood after update
        await fetchTodayMood();
        return { success: true, data: data.data };
      } else {
        const errorMessage = data?.message || "Failed to update mood.";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      console.error("Failed to update mood:", err);
      const errorData = err.response?.data;
      const errorMessage = errorData?.message || "Failed to update your mood. Please try again.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  };

  // Get mood history
  const getMoodHistory = async (days = 30, limit = 100) => {
    try {
      const response = await moodApi.get(`history/?days=${days}&limit=${limit}`);
      const data = response.data;

      if (data?.success) {
        return { success: true, data: data.data };
      } else {
        return { success: false, error: data?.message || "Failed to fetch mood history." };
      }
    } catch (err) {
      console.error("Failed to fetch mood history:", err);
      const errorData = err.response?.data;
      return {
        success: false,
        error: errorData?.message || "Failed to fetch mood history. Please try again.",
      };
    }
  };

  // Clear error
  const clearError = () => {
    setError("");
  };

  // Fetch today's mood when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchTodayMood();
    } else {
      setTodayMood(null);
      setLoading(false);
      setError("");
    }
  }, [isAuthenticated, fetchTodayMood]);

  const value = {
    todayMood,
    loading,
    submitting,
    error,
    fetchTodayMood,
    submitMood,
    updateMood,
    getMoodHistory,
    clearError,
  };

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
};

export const useMood = () => {
  const context = useContext(MoodContext);
  if (!context) throw new Error("useMood must be used within a MoodProvider");
  return context;
};
