import React from "react";

const SectionButton = ({ icon, name, onClick, iconColor = "text-blue-600", className = "" }) => {
  return (
    <div
      className={`
        bg-white dark:bg-gray-800 
        p-3 rounded-xl 
        border border-gray-200 dark:border-gray-700 
        hover:bg-gray-50 dark:hover:bg-gray-700
        transition-colors duration-200
        cursor-pointer
        ${className}
      `}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="flex flex-row items-center justify-center gap-2">
        {icon && (
          <div className={`${iconColor} dark:text-white`}>
            {icon}
          </div>
        )}
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          {name}
        </h3>
      </div>
    </div>
  );
};

export default SectionButton;
