import React from "react";

/**
 * Generic StatusCapsule component for displaying status badges
 * 
 * @param {string} label - Text to display in the capsule
 * @param {string} variant - Color variant: 'success' (green), 'warning' (yellow), 'danger' (red), 'info' (blue), 'purple', 'orange'
 * @param {string} size - Size variant: 'sm' (small), 'md' (medium), 'lg' (large)
 * @param {string} className - Additional CSS classes
 */
const StatusCapsule = ({ label, variant = "info", size = "sm", className = "" }) => {
  const variantClasses = {
    success: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400",
    warning: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400",
    danger: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400",
    info: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400",
    orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400",
    indigo: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const baseClasses = "font-medium rounded-full inline-block";

  return (
    <span
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.info} ${sizeClasses[size]} ${className}`}
    >
      {label}
    </span>
  );
};

export default StatusCapsule;
