import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "../../components/layout/AdminNavbar";
import adminApi from "../../services/adminApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminApi.get("dashboard/");
      const data = response.data;

      if (data?.success) {
        setStats(data.data);
      } else {
        setError(data?.message || "Failed to load dashboard statistics");
      }
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
      const errorData = err.response?.data;
      setError(
        errorData?.message || "Failed to load dashboard statistics. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "View Members",
      description: "View and manage all member accounts",
      link: "/admin/members",
      icon: "👥",
      color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    },
    {
      title: "View Specialists",
      description: "View and manage all specialist accounts",
      link: "/admin/specialists",
      icon: "👨‍⚕️",
      color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    },
    {
      title: "Create Member",
      description: "Create a new member account",
      link: "/admin/create-member",
      icon: "➕",
      color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
    },
    {
      title: "Create Specialist",
      description: "Create a new specialist account",
      link: "/admin/create-specialist",
      icon: "➕",
      color: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AdminNavbar />
        <div className="flex justify-center items-center py-20">
          <Loader fullScreen={false} size={50} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Overview of members, specialists, and system statistics
          </p>
        </div>

        <ErrorMessage message={error} />

        {stats && (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Users */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Users
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {stats.overview?.total_users || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <span className="text-2xl">👥</span>
                  </div>
                </div>
              </div>

              {/* Total Members */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Members
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {stats.overview?.total_members || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <span className="text-2xl">👤</span>
                  </div>
                </div>
              </div>

              {/* Total Specialists */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Specialists
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {stats.overview?.total_specialists || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    <span className="text-2xl">👨‍⚕️</span>
                  </div>
                </div>
              </div>

              {/* Recent Registrations (7 days) */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      New (7 days)
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {stats.recent_registrations?.last_7_days?.total || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                    <span className="text-2xl">📈</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Verification Status */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Verification Status
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Members</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {stats.verification_status?.members?.verified || 0} verified / {stats.verification_status?.members?.unverified || 0} unverified
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${stats.overview?.total_members > 0 
                            ? (stats.verification_status?.members?.verified / stats.overview.total_members) * 100 
                            : 0}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Specialists</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {stats.verification_status?.specialists?.verified || 0} verified / {stats.verification_status?.specialists?.unverified || 0} unverified
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${stats.overview?.total_specialists > 0 
                            ? (stats.verification_status?.specialists?.verified / stats.overview.total_specialists) * 100 
                            : 0}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Registrations */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Registrations
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Last 7 days</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {stats.recent_registrations?.last_7_days?.total || 0} users
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Last 30 days</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {stats.recent_registrations?.last_30_days?.total || 0} users
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Breakdown (7 days)
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Members: {stats.recent_registrations?.last_7_days?.members || 0}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        Specialists: {stats.recent_registrations?.last_7_days?.specialists || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className={`${action.color} border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl">{action.icon}</span>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {action.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                          {action.description}
                        </p>
                      </div>
                      <svg
                        className="w-6 h-6 text-gray-400 dark:text-gray-500"
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
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
