import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import MemberDashboard from "./MemberDashboard";
import SpecialistDashboard from "./SpecialistDashboard";
import Loader from "../../components/common/Loader";
import dashboardApi from "../../services/dashboardApi";

const Dashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (authLoading) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await dashboardApi.get("");
        const responseData = response.data;
        
        // Handle standardized response format
        if (responseData.success && responseData.data) {
          setDashboardData(responseData.data);
        } else {
          setDashboardData(responseData);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError(err.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [authLoading]);

  if (authLoading || isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-900 min-h-screen p-6">
        <div className="max-w-[1440px] mx-auto w-full">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (user?.role === "specialist") {
    return <SpecialistDashboard dashboardData={dashboardData} />;
  }

  return <MemberDashboard dashboardData={dashboardData} />;
};

export default Dashboard;
