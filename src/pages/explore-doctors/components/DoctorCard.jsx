import React from "react";
import { Link } from "react-router-dom";
import { useCard } from "../../../context/CardContext";
import { useModal } from "../../../context/ModalContext";
import { useAuth } from "../../../context/AuthContext";
import { getMediaUrl } from "../../../utils/imageUtils";
import StatusCapsule from "../../../components/common/StatusCapsule";
import AppointmentRequestModal from "./AppointmentRequestModal";

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

const DoctorCard = ({ doctor }) => {
  const { Card, CardHeader, CardFooter } = useCard();
  const { openModal, closeModal } = useModal();
  const { user } = useAuth();

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
  const isMember = user?.role === "member";
  const hasExistingAppointment = Boolean(doctor.has_existing_appointment);

  const handleRequestAppointment = () => {
    openModal(
      <AppointmentRequestModal
        doctor={doctor}
        onSuccess={() => closeModal()}
        onClose={closeModal}
      />,
      {
        width: "800px",
      }
    );
  };

  const cardContent = (
    <>
      <CardHeader className="!py-3 !px-4 !border-b !border-neutral-100 dark:!border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            {headshotUrl ? (
              <img
                src={headshotUrl}
                alt={displayName}
                className="w-10 h-10 rounded-full object-cover ring-1 ring-neutral-200 dark:ring-neutral-700"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center ring-1 ring-teal-100 dark:ring-teal-900/50">
                <span className="text-sm font-semibold text-teal-700 dark:text-teal-400">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white truncate tracking-tight">
              {displayName}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
              {specialistType}
            </p>
            <div className="mt-1.5">
              <StatusCapsule label={statusLabel} variant={variant} size="sm" />
            </div>
          </div>
        </div>
      </CardHeader>
      {isMember && (
        <CardFooter className="!py-3 !px-4 !border-t !border-neutral-100 dark:!border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
          {hasExistingAppointment ? (
            <>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2 text-center">
                Already has appointment
              </p>
              <Link
                to="/appointments"
                className="block w-full py-2 px-3 text-xs font-medium rounded-md text-center border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:ring-offset-1 transition-colors"
              >
                View appointments
              </Link>
            </>
          ) : (
            <button
              type="button"
              onClick={handleRequestAppointment}
              className="w-full py-2 px-3 text-xs font-medium rounded-md bg-teal-600 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 dark:focus:ring-offset-neutral-900 transition-colors shadow-sm"
            >
              Request appointment
            </button>
          )}
        </CardFooter>
      )}
    </>
  );

  return (
    <Card
      cardContent={cardContent}
      className="!p-0 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow transition-shadow"
    />
  );
};

export default DoctorCard;
