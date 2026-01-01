import React from "react";
import { useModal } from "../context/ModalContext";

const DailyQuoteModal = ({ quote }) => {
  const { closeModal } = useModal();

  if (!quote) return null;

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <svg
            className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Daily Inspiration
          </h3>
        </div>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed italic">
          "{quote.text}"
        </p>
      </div>
      <button
        onClick={closeModal}
        className="w-full px-4 py-2.5 rounded-full text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition"
      >
        Close
      </button>
    </div>
  );
};

export default DailyQuoteModal;



