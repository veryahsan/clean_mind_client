import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import MessageIcon from "@mui/icons-material/Message";
import PersonIcon from "@mui/icons-material/Person";
import ScheduleIcon from "@mui/icons-material/Schedule";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SectionButton from "../../components/common/SectionButton";
import profileApi from "../../services/profileApi";
import Loader from "../../components/common/Loader";
import AvailabilityStatusDropdown from "../../components/common/AvailabilityStatusDropdown";

const SpecialistDashboard = ({ dashboardData }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [availabilityStatus, setAvailabilityStatus] = useState(user?.availability_status || 'offline');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch profile data to get availability status
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileApi.get("");
        const responseData = response.data;
        const profileData = responseData.success && responseData.data ? responseData.data : responseData;
        if (profileData.availability_status) {
          setAvailabilityStatus(profileData.availability_status);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleStatusChange = (newStatus) => {
    setAvailabilityStatus(newStatus);
  };

  const sections = [
    {
      name: "Appointments",
      icon: <EventIcon sx={{ fontSize: 24 }} />,
      iconColor: "text-indigo-600 dark:text-indigo-400",
      onClick: () => navigate("/appointments"),
    },
    {
      name: "Patients",
      icon: <PeopleIcon sx={{ fontSize: 24 }} />,
      iconColor: "text-teal-600 dark:text-teal-400",
      onClick: () => navigate("/patients"),
    },
    {
      name: "Messages",
      icon: <MessageIcon sx={{ fontSize: 24 }} />,
      iconColor: "text-cyan-600 dark:text-cyan-400",
      onClick: () => navigate("/messages"),
    },
    {
      name: "Profile",
      icon: <PersonIcon sx={{ fontSize: 24 }} />,
      iconColor: "text-blue-600 dark:text-blue-400",
      onClick: () => navigate("/profile"),
    },
    {
      name: "Schedule",
      icon: <ScheduleIcon sx={{ fontSize: 24 }} />,
      iconColor: "text-orange-600 dark:text-orange-400",
      onClick: () => navigate("/schedule"),
    },
    {
      name: "Resources",
      icon: <MenuBookIcon sx={{ fontSize: 24 }} />,
      iconColor: "text-purple-600 dark:text-purple-400",
      onClick: () => navigate("/resources"),
    },
  ];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen p-6">
      <div className="max-w-[1440px] mx-auto w-full">
        {/* Welcome Section with Availability Status */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Welcome, {user?.first_name || user?.username || "Specialist"}
            </h1>
          </div>
          
          {/* Availability Status Toggle */}
          <AvailabilityStatusDropdown
            currentStatus={availabilityStatus}
            onStatusChange={handleStatusChange}
            size="sm"
          />
        </div>

        {/* Quick Access - Minimalist */}
        <div className="flex flex-wrap gap-4 mb-6">
          {sections.map((section) => (
            <SectionButton
              key={section.name}
              icon={section.icon}
              name={section.name}
              iconColor={section.iconColor}
              onClick={section.onClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecialistDashboard;
