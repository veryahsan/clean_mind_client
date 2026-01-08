import React from "react";
import { useMood } from "../../context/MoodContext";
import { useModal } from "../../context/ModalContext";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";
import MoodSelectionModal from "../../modals/MoodSelectionModal";
import {
  moodLabels,
  moodEmojis,
  moodBg,
} from "../../constants/moods";

const MoodTracker = () => {
  const { todayMood, loading, error } = useMood();
  const { openModal } = useModal();

  const handleOpenMoodModal = (e) => {
    if (e) {
      e.stopPropagation();
    }
    
    if (!openModal) {
      console.error("openModal is not available from ModalContext");
      return;
    }

    const modalContent = (
      <MoodSelectionModal
        initialMood={todayMood?.mood_type || null}
        isUpdate={!!todayMood}
      />
    );

    openModal(modalContent);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader fullScreen={false} size={32} />
      </div>
    );
  }

  return (
    <div className="w-full">
      <ErrorMessage message={error} />

      {todayMood ? (
        <div
          onClick={handleOpenMoodModal}
          className={`
            ${moodBg[todayMood.mood_type]}
            rounded-xl p-5
            border border-gray-200 dark:border-gray-700
            cursor-pointer transition
            hover:shadow-md
            active:scale-[0.99]
          `}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 text-4xl">
                {moodEmojis[todayMood.mood_type]}
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Today's Mood
                </p>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {moodLabels[todayMood.mood_type]}
                </h3>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenMoodModal(e);
              }}
              className="text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50"
            >
              Change
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleOpenMoodModal}
          className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center cursor-pointer transition hover:shadow-md hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10"
        >
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Track Your Mood
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Click to select how you're feeling today
          </p>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;
