import React, { useState, useEffect } from "react";
import { dailyQuotes, getRandomQuote } from "../../constants/dailyQuotes";

const DailyQuoteCapsule = ({ maxWidth = "3000px" }) => {
  const [currentIndex, setCurrentIndex] = useState(null);
  const [quote, setQuote] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState("next");

  useEffect(() => {
    // Get a random quote on mount and find its index
    const randomQuote = getRandomQuote();
    const index = dailyQuotes.findIndex((q) => q.id === randomQuote.id);
    setCurrentIndex(index >= 0 ? index : 0);
    setQuote(randomQuote);
  }, []);

  const handlePrevious = (e) => {
    e.stopPropagation();
    if (currentIndex !== null && !isAnimating) {
      setIsAnimating(true);
      setDirection("prev");
      
      setTimeout(() => {
        const newIndex = currentIndex === 0 ? dailyQuotes.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
        setQuote(dailyQuotes[newIndex]);
        
        setTimeout(() => {
          setIsAnimating(false);
        }, 50);
      }, 200);
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (currentIndex !== null && !isAnimating) {
      setIsAnimating(true);
      setDirection("next");
      
      setTimeout(() => {
        const newIndex = (currentIndex + 1) % dailyQuotes.length;
        setCurrentIndex(newIndex);
        setQuote(dailyQuotes[newIndex]);
        
        setTimeout(() => {
          setIsAnimating(false);
        }, 50);
      }, 200);
    }
  };

  if (!quote) return null;

  return (
    <div
      className="group px-2.5 py-1.5 bg-gray-50/50 dark:bg-gray-800/30 rounded-md border border-gray-200/50 dark:border-gray-700/30 hover:bg-gradient-to-r hover:from-indigo-50/60 hover:to-purple-50/60 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 hover:border-indigo-200/60 dark:hover:border-indigo-700/40 transition-all duration-300 cursor-text opacity-75 hover:opacity-100"
      style={{ maxWidth }}
    >
      <div className="flex items-center gap-1.5">
        {/* Previous Arrow */}
        <button
          onClick={handlePrevious}
          disabled={isAnimating}
          className="flex-shrink-0 p-0.5 rounded hover:bg-indigo-100/50 dark:hover:bg-indigo-800/30 active:scale-90 transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed opacity-60 hover:opacity-100"
          aria-label="Previous quote"
        >
          <svg
            className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Quote Icon */}
        <svg
          className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 flex-shrink-0 transition-colors duration-300 opacity-50 group-hover:opacity-70"
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

        {/* Quote Text */}
        <p 
          className={`text-xs text-gray-500 dark:text-gray-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 leading-relaxed flex-1 min-w-0 transition-all duration-300 ${
            isAnimating 
              ? `opacity-0 transform ${direction === "next" ? "translate-x-4" : "-translate-x-4"}` 
              : "opacity-100 translate-x-0"
          }`}
        >
          {quote.text}
        </p>

        {/* Next Arrow */}
        <button
          onClick={handleNext}
          disabled={isAnimating}
          className="flex-shrink-0 p-0.5 rounded hover:bg-indigo-100/50 dark:hover:bg-indigo-800/30 active:scale-90 transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed opacity-60 hover:opacity-100"
          aria-label="Next quote"
        >
          <svg
            className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DailyQuoteCapsule;

