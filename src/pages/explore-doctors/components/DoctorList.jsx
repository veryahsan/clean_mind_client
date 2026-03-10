import React from "react";
import DoctorCard from "./DoctorCard";

const DoctorList = ({ doctors, selectedDoctorId, onSelectDoctor }) => {
  if (!Array.isArray(doctors) || doctors.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-8 text-center">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          No doctors are available at the moment. Check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-2 py-3 space-y-3">
      {doctors.map((doctor) => (
        <DoctorCard
          key={doctor.id}
          doctor={doctor}
          selected={doctor.id === selectedDoctorId}
          onSelect={() => onSelectDoctor(doctor.id)}
        />
      ))}
    </div>
  );
};

export default DoctorList;

