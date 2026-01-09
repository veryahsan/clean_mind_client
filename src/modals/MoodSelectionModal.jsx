import React, { useState } from "react";
import { useModal } from "../context/ModalContext";
import { useMood } from "../context/MoodContext";
import {
  availableMoods,
  moodLabels,
  moodEmojis,
  moodBg,
} from "../constants/moods";

const MoodSelectionModal = ({ initialMood = null, isUpdate = false }) => {
  const { closeModal } = useModal();
  const { submitMood, updateMood, submitting, clearError } = useMood();
  const [selectedMood, setSelectedMood] = useState(initialMood);

  const handleSelectMood = async (moodType) => {
    if (submitting) return;

    clearError();
    setSelectedMood(moodType);

    try {
      let result;
      if (isUpdate) {
        result = await updateMood(moodType);
      } else {
        result = await submitMood(moodType);
      }

      if (result.success) {
        // Close modal after successful submission
        setTimeout(() => {
          closeModal();
        }, 300);
      }
    } catch (error) {
      console.error("Failed to save mood:", error);
    }
  };

  return (
    <div>
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {isUpdate ? "Update Your Mood" : "How Are You Feeling Today?"}
      </h3>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
        Select how you're feeling right now
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 mb-6">
        {availableMoods.map((moodType) => {
          const emoji = moodEmojis[moodType];
          const isSelected = selectedMood === moodType;

          return (
            <button
              key={moodType}
              onClick={() => handleSelectMood(moodType)}
              disabled={submitting}
              className={`
                flex flex-col items-center justify-center py-3 sm:py-4 rounded-xl
                border-2 transition-all duration-200 aspect-square min-w-[70px] sm:min-w-[80px]
                ${
                  isSelected
                    ? `${moodBg[moodType]} border-indigo-500 ring-2 ring-indigo-400/40 shadow-lg scale-[1.05]`
                    : `${moodBg[moodType]} border-gray-200 dark:border-gray-700 hover:border-indigo-400 hover:shadow-md hover:scale-[1.02]`
                }
                active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <span className="text-3xl sm:text-4xl mb-1 sm:mb-2 transition-transform hover:scale-110">
                {emoji}
              </span>
              <span
                className={`text-[10px] sm:text-xs font-semibold ${
                  isSelected
                    ? "text-indigo-700 dark:text-indigo-300"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {moodLabels[moodType]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button
          onClick={closeModal}
          disabled={submitting}
          className="flex-1 px-4 py-2.5 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default MoodSelectionModal;

