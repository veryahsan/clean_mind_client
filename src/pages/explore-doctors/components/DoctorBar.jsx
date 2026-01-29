import React from "react";
import { Link } from "react-router-dom";
import { useModal } from "../../../context/ModalContext";
import { getMediaUrl } from "../../../utils/imageUtils";
import StatusCapsule from "../../../components/common/StatusCapsule";

const AVAILABILITY_VARIANTS = {
  available: "success",
  offline: "info",
  "on-leave": "warning",
  "in-emergency": "danger",
};

const AVAILABILITY_LABELS = {
  available: "Available",
  offline: "Offline",
  "on-leave": "On Leave",
  "in-emergency": "In Emergency",
};

const DoctorBar = ({ doctor, showProfile = false, showAppointmentStatus=false}) => {
  const { openModal } = useModal();

  const displayName =
    [doctor.first_name, doctor.last_name].filter(Boolean).join(" ") ||
    doctor.username;
  const specialistType =
    doctor.specialist_type_display || doctor.specialist_type || "Specialist";
  const availabilityStatus = doctor.availability_status || "offline";
  const variant = AVAILABILITY_VARIANTS[availabilityStatus] || "info";
  const statusLabel =
    AVAILABILITY_LABELS[availabilityStatus] || availabilityStatus;

  const headshotUrl = getMediaUrl(doctor.headshot);

  const handleQuickLook = (e) => {
    e.preventDefault();
    openModal(
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight">
          {displayName}
        </h3>
        <div className="flex items-center gap-5">
          {headshotUrl ? (
            <img
              src={headshotUrl}
              alt={displayName}
              className="w-20 h-20 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-neutral-600 shadow-md shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center ring-2 ring-teal-100 dark:ring-teal-800/50 shadow-md shrink-0">
              <span className="text-2xl font-semibold text-teal-700 dark:text-teal-400 tracking-tight">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="min-w-0">
            <p className="text-base font-medium text-neutral-700 dark:text-neutral-300">
              {specialistType}
            </p>
            <div className="mt-2">
              <StatusCapsule label={statusLabel} variant={variant} size="sm" />
            </div>
          </div>
        </div>
        {doctor.email && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            {doctor.email}
          </p>
        )}
      </div>,
      { width: "400px" }
    );
  };

  const profilePath = `/profile/doctor/${doctor.id}`;

  return (
    <div
      className="flex items-center gap-4 py-4 px-4 border-b border-neutral-100 dark:border-neutral-800 last:border-b-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
      role="listitem"
    >
      <div className="shrink-0">
        {headshotUrl ? (
          <img
            src={headshotUrl}
            alt={displayName}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-neutral-600 shadow-sm"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center ring-2 ring-teal-100 dark:ring-teal-800/50 shadow-sm">
            <span className="text-lg font-semibold text-teal-700 dark:text-teal-400 tracking-tight">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-base font-semibold text-neutral-900 dark:text-white truncate tracking-tight leading-tight">
          {displayName}
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate mt-0.5 font-medium">
          {specialistType}
        </p>
        <div className="mt-2">
          <StatusCapsule label={statusLabel} variant={variant} size="sm" />
        </div>
      </div>
      {showProfile && (
        <div className="shrink-0 flex items-center gap-x-4 text-xs">
          <a
            href="#"
            onClick={handleQuickLook}
            className="inline-flex items-center gap-1.5 text-teal-600 dark:text-teal-400 underline hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Quick look
          </a>
          <Link
            to={profilePath}
            className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile
          </Link>
        </div>
      )}
      {showAppointmentStatus && (
        <div className="shrink-0 flex items-center gap-x-4 text-xs">
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-purple-600 dark:text-purple-400 underline hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Show status
          </a>
        </div>
      )}
    </div>
  );
};

export default DoctorBar;
