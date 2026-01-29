import React from "react";
import DoctorBar from "./DoctorBar";

const YourDoctors = ({ doctors }) => {
  if (!doctors || doctors.length === 0) {
    return null;
  }

  return (
    <ul
      className="divide-y divide-neutral-100 dark:divide-neutral-800"
      aria-label="Your doctors list"
    >
      {doctors.map((doctor) => (
        <li key={doctor.id}>
          <DoctorBar doctor={doctor} showProfile={false} showAppointmentStatus={true}/>
        </li>
      ))}
    </ul>
  );
};

export default YourDoctors;
