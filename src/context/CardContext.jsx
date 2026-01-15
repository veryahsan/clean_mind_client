import React, { createContext, useContext } from "react";

const CardContext = createContext(null);

export const CardProvider = ({ children }) => {
  const Card = ({ cardContent, className = "", ...props }) => {
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition ${className}`}
        {...props}
      >
        {cardContent}
      </div>
    );
  };

  const CardHeader = ({ title, children, className = "" }) => {
    return (
      <div className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${className}`}>
        {title && (
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
        )}
        {children}
      </div>
    );
  };

  const CardBody = ({ children, className = "" }) => {
    return (
      <div className={`p-6 ${className}`}>
        {children}
      </div>
    );
  };

  const CardFooter = ({ children, className = "" }) => {
    return (
      <div className={`px-6 py-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>
        {children}
      </div>
    );
  };

  const EmptyState = ({ message, className = "" }) => {
    return (
      <div className={`p-12 text-center ${className}`}>
        <p className="text-gray-500 dark:text-gray-400">
          {message}
        </p>
      </div>
    );
  };

  const value = {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    EmptyState,
  };

  return (
    <CardContext.Provider value={value}>
      {children}
    </CardContext.Provider>
  );
};

export const useCard = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error("useCard must be used within a CardProvider");
  }
  return context;
};

export default CardContext;
