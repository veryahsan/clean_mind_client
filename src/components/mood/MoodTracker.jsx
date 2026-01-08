import React, { useState } from "react";
import { useMood } from "../../context/MoodContext";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";

import {
  availableMoods,
  moodLabels,
  moodIcons,
  moodBg,
} from "../../constants/moods";

const MoodTracker = () => {
  const {
    todayMood,
    loading,
    submitting,
    error,
    submitMood,
    updateMood,
    clearError,
  } = useMood();
  const [showUpdate, setShowUpdate] = useState(false);

  const handleMoodSelect = async (moodType) => {
    clearError();
    const result = await submitMood(moodType);
    if (result.success) {
      setShowUpdate(false);
    }
  };

  const handleUpdateMood = async (moodType) => {
    clearError();
    const result = await updateMood(moodType);
    if (result.success) {
      setShowUpdate(false);
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
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
        How Are You Feeling Today?
      </h2>

      <ErrorMessage message={error} />

      {todayMood ? (
        <div>
          <div
            className={`
              ${moodBg[todayMood.mood_type]}
              rounded-lg p-4 mb-3
              border transition-all duration-200
              ${showUpdate ? "border-indigo-500" : "border-gray-200 dark:border-gray-700"}
              flex items-center justify-between
            `}
          >
            <div className="flex items-center gap-3">
              {(() => {
                const Icon = moodIcons[todayMood.mood_type];
                return (
                  <Icon
                    fontSize="large"
                    className="text-indigo-600 dark:text-indigo-400"
                  />
                );
              })()}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {moodLabels[todayMood.mood_type]}
              </h3>
            </div>
            {!showUpdate && (
              <button
                onClick={() => setShowUpdate(true)}
                disabled={submitting}
                className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition disabled:opacity-50"
              >
                Change
              </button>
            )}
          </div>

          {showUpdate && (
            <MoodSelectionGrid
              moods={availableMoods}
              onSelect={handleUpdateMood}
              submitting={submitting}
              selectedMood={todayMood.mood_type}
            />
          )}
        </div>
      ) : (
        <MoodSelectionGrid
          moods={availableMoods}
          onSelect={handleMoodSelect}
          submitting={submitting}
          selectedMood={null}
        />
      )}
    </div>
  );
};

const MoodSelectionGrid = ({ moods, onSelect, submitting, selectedMood }) => {
  return (
    <div className="grid grid-cols-5 gap-3">
      {moods.map((moodType) => {
        const Icon = moodIcons[moodType];
        const isSelected = selectedMood === moodType;

        return (
          <button
            key={moodType}
            onClick={() => onSelect(moodType)}
            disabled={submitting}
            className={`
              flex flex-col items-center justify-center py-3 rounded-xl
              border transition-all duration-200
              ${
                isSelected
                  ? `${moodBg[moodType]} border-indigo-500 ring-2 ring-indigo-400/40 shadow-md scale-[1.03]`
                  : `border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:shadow-md hover:-translate-y-0.5 ${moodBg[moodType]}`
              }
              active:scale-95
              disabled:opacity-50
            `}
          >
            <Icon
              fontSize="medium"
              className={`mb-1 transition-colors ${
                isSelected
                  ? "text-indigo-700 dark:text-indigo-300"
                  : "text-gray-700 dark:text-gray-200"
              }`}
            />
            <span
              className={`text-xs font-semibold ${
                isSelected
                  ? "text-indigo-700 dark:text-indigo-300"
                  : "text-gray-700 dark:text-gray-200"
              }`}
            >
              {moodLabels[moodType]}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default MoodTracker;
