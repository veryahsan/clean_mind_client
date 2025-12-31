import React from "react";
import { useAuth } from "../../context/AuthContext";

const MemberDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome, {user?.username}!
        </h1>
        <p className="text-gray-700 mb-6">
          This is your dashboard. Here you can manage your account, see stats,
          and access member-only features.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Profile
          </h2>
          <p className="text-gray-700">
            Update your profile information and settings.
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Activities
          </h2>
          <p className="text-gray-700">
            Track your activities and progress here.
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Resources
          </h2>
          <p className="text-gray-700">
            Access exclusive resources and tips for mental wellness.
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
