import React from "react";
import { useAuth } from "../../context/AuthContext";
import MemberDashboard from "./MemberDashboard";
import SpecialistDashboard from "./SpecialistDashboard";
import Loader from "../../components/common/Loader";

const Dashboard = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (user?.role === "specialist") {
    return <SpecialistDashboard />;
  }

  return <MemberDashboard />;
};

export default Dashboard;
