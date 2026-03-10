import React from "react";
import { useAuth } from "../../context/AuthContext";
import MemberAppointments from "./MemberAppointments";
import SpecialistAppointments from "./SpecialistAppointments";

const Appointments = () => {
  const { user } = useAuth();

  if (user?.role === "specialist") {
    return <SpecialistAppointments />;
  }

  // Default to member view for members and any other roles
  return <MemberAppointments />;
};

export default Appointments;

