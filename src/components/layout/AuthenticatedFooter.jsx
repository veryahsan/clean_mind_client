import React from "react";

const AuthenticatedFooter = ({ className = "" }) => {
  return (
    <div
      className={`border-t border-gray-200 dark:border-neutral-700 p-3 ${className}`}
    >
      <div className="flex flex-col gap-2">
        <div className="text-[11px] text-gray-500 dark:text-gray-400">
          © 2026 CleanMind, Inc.
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
          <a
            href="#"
            className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition"
          >
            Community
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedFooter;

