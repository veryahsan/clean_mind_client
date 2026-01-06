import React from "react";
import { useAuth } from "../../context/AuthContext";
import MoodTracker from "../../components/mood/MoodTracker";

const MemberDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Mood Tracker - Compact */}
        <div className="mb-6">
          <MoodTracker />
        </div>

        {/* Other Dashboard Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Profile
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Update your profile information and settings.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Activities
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Track your activities and progress here.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Resources
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Access exclusive resources and tips for mental wellness.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
