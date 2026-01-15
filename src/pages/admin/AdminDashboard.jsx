import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "../../components/layout/AdminNavbar";
import adminApi from "../../services/adminApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import StatusCapsule from "../../components/common/StatusCapsule";
import {
  People,
  Person,
  MedicalServices,
  TrendingUp,
  Groups,
  PersonAdd,
  AddCircle,
  ArrowForward,
} from "@mui/icons-material";

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
      icon: <Groups className="text-3xl" />,
      color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    },
    {
      title: "View Specialists",
      description: "View and manage all specialist accounts",
      link: "/admin/specialists",
      icon: <MedicalServices className="text-3xl" />,
      color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    },
    {
      title: "Create Member",
      description: "Create a new member account",
      link: "/admin/create-member",
      icon: <PersonAdd className="text-3xl" />,
      color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
    },
    {
      title: "Create Specialist",
      description: "Create a new specialist account",
      link: "/admin/create-specialist",
      icon: <AddCircle className="text-3xl" />,
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
                    <People className="text-2xl text-blue-600 dark:text-blue-400" />
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
                    <Person className="text-2xl text-green-600 dark:text-green-400" />
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
                    <MedicalServices className="text-2xl text-purple-600 dark:text-purple-400" />
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
                    <TrendingUp className="text-2xl text-orange-600 dark:text-orange-400" />
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
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Members</span>
                      <div className="flex items-center gap-2">
                        <StatusCapsule 
                          label={`${stats.verification_status?.members?.verified || 0} verified`} 
                          variant="success" 
                        />
                        <StatusCapsule 
                          label={`${stats.verification_status?.members?.unverified || 0} unverified`} 
                          variant="warning" 
                        />
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 relative overflow-hidden">
                      <div
                        className="bg-green-500 h-3 rounded-full absolute left-0"
                        style={{
                          width: `${stats.overview?.total_members > 0 
                            ? (stats.verification_status?.members?.verified / stats.overview.total_members) * 100 
                            : 0}%`
                        }}
                      ></div>
                      <div
                        className="bg-yellow-500 h-3 rounded-full absolute"
                        style={{
                          left: `${stats.overview?.total_members > 0 
                            ? (stats.verification_status?.members?.verified / stats.overview.total_members) * 100 
                            : 0}%`,
                          width: `${stats.overview?.total_members > 0 
                            ? (stats.verification_status?.members?.unverified / stats.overview.total_members) * 100 
                            : 0}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Specialists</span>
                      <div className="flex items-center gap-2">
                        <StatusCapsule 
                          label={`${stats.verification_status?.specialists?.verified || 0} verified`} 
                          variant="success" 
                        />
                        <StatusCapsule 
                          label={`${stats.verification_status?.specialists?.unverified || 0} unverified`} 
                          variant="warning" 
                        />
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 relative overflow-hidden">
                      <div
                        className="bg-green-500 h-3 rounded-full absolute left-0"
                        style={{
                          width: `${stats.overview?.total_specialists > 0 
                            ? (stats.verification_status?.specialists?.verified / stats.overview.total_specialists) * 100 
                            : 0}%`
                        }}
                      ></div>
                      <div
                        className="bg-yellow-500 h-3 rounded-full absolute"
                        style={{
                          left: `${stats.overview?.total_specialists > 0 
                            ? (stats.verification_status?.specialists?.verified / stats.overview.total_specialists) * 100 
                            : 0}%`,
                          width: `${stats.overview?.total_specialists > 0 
                            ? (stats.verification_status?.specialists?.unverified / stats.overview.total_specialists) * 100 
                            : 0}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Status */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Active Status
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Members</span>
                      <div className="flex items-center gap-2">
                        <StatusCapsule 
                          label={`${stats.active_status?.members?.active || 0} active`} 
                          variant="success" 
                        />
                        <StatusCapsule 
                          label={`${stats.active_status?.members?.inactive || 0} inactive`} 
                          variant="danger" 
                        />
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 relative overflow-hidden">
                      <div
                        className="bg-green-500 h-3 rounded-full absolute left-0"
                        style={{
                          width: `${stats.overview?.total_members > 0 
                            ? (stats.active_status?.members?.active / stats.overview.total_members) * 100 
                            : 0}%`
                        }}
                      ></div>
                      <div
                        className="bg-red-500 h-3 rounded-full absolute"
                        style={{
                          left: `${stats.overview?.total_members > 0 
                            ? (stats.active_status?.members?.active / stats.overview.total_members) * 100 
                            : 0}%`,
                          width: `${stats.overview?.total_members > 0 
                            ? (stats.active_status?.members?.inactive / stats.overview.total_members) * 100 
                            : 0}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Specialists</span>
                      <div className="flex items-center gap-2">
                        <StatusCapsule 
                          label={`${stats.active_status?.specialists?.active || 0} active`} 
                          variant="success" 
                        />
                        <StatusCapsule 
                          label={`${stats.active_status?.specialists?.inactive || 0} inactive`} 
                          variant="danger" 
                        />
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 relative overflow-hidden">
                      <div
                        className="bg-green-500 h-3 rounded-full absolute left-0"
                        style={{
                          width: `${stats.overview?.total_specialists > 0 
                            ? (stats.active_status?.specialists?.active / stats.overview.total_specialists) * 100 
                            : 0}%`
                        }}
                      ></div>
                      <div
                        className="bg-red-500 h-3 rounded-full absolute"
                        style={{
                          left: `${stats.overview?.total_specialists > 0 
                            ? (stats.active_status?.specialists?.active / stats.overview.total_specialists) * 100 
                            : 0}%`,
                          width: `${stats.overview?.total_specialists > 0 
                            ? (stats.active_status?.specialists?.inactive / stats.overview.total_specialists) * 100 
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
                    <StatusCapsule 
                      label={`${stats.recent_registrations?.last_7_days?.total || 0} users`} 
                      variant="info" 
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Last 30 days</span>
                    <StatusCapsule 
                      label={`${stats.recent_registrations?.last_30_days?.total || 0} users`} 
                      variant="indigo" 
                    />
                  </div>
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Breakdown (7 days)
                    </div>
                    <div className="flex justify-between text-sm gap-2">
                      <StatusCapsule 
                        label={`Members: ${stats.recent_registrations?.last_7_days?.members || 0}`} 
                        variant="success" 
                      />
                      <StatusCapsule 
                        label={`Specialists: ${stats.recent_registrations?.last_7_days?.specialists || 0}`} 
                        variant="purple" 
                      />
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
                      <ArrowForward className="w-6 h-6 text-gray-400 dark:text-gray-500" />
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
