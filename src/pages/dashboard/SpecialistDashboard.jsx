import React from "react";
import { useAuth } from "../../context/AuthContext";

const SpecialistDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome, {user?.first_name || user?.username || "Specialist"}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your practice and connect with members.
          </p>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Appointments
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              View and manage your upcoming appointments.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Patients
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Access your patient list and records.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Messages
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Communicate with your patients.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Profile
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Update your professional profile and credentials.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Schedule
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Manage your availability and calendar.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Resources
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Access professional resources and tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialistDashboard;
