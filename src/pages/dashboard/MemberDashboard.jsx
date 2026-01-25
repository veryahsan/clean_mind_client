import React from "react";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import MoodTracker from "../../components/mood/MoodTracker";
import SectionButton from "../../components/common/SectionButton";

const MemberDashboard = ({ dashboardData }) => {
  const navigate = useNavigate();

  const sections = [
    {
      name: "Profile",
      icon: <PersonIcon sx={{ fontSize: 24 }} />,
      iconColor: "text-blue-600 dark:text-blue-400",
      onClick: () => navigate("/profile"),
    },
    {
      name: "Activities",
      icon: <FitnessCenterIcon sx={{ fontSize: 24 }} />,
      iconColor: "text-green-600 dark:text-green-400",
      onClick: () => navigate("/activities"),
    },
    {
      name: "Resources",
      icon: <MenuBookIcon sx={{ fontSize: 24 }} />,
      iconColor: "text-purple-600 dark:text-purple-400",
      onClick: () => navigate("/resources"),
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Mood Tracker - Compact */}
        <div className="mb-6">
          <MoodTracker />
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

export default MemberDashboard;
