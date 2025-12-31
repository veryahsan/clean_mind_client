import React from "react";

const AuthenticatedFooter = ({ className = "" }) => {
  return (
    <div className={`border-t border-gray-200 dark:border-neutral-700 p-4 ${className}`}>
      <div className="flex flex-col gap-3">
        <div className="text-xs text-gray-600 dark:text-gray-400">
          © 2026 CleanMind, Inc.
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
          <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition">
            Terms
          </a>
          <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition">
            Privacy
          </a>
          <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition">
            Community
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedFooter;

