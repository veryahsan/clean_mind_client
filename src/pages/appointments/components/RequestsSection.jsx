import React from "react";
import { useModal } from "../../../context/ModalContext";
import SpecialistAppointmentRow from "./SpecialistAppointmentRow";
import AppointmentRequestDetailModal from "./AppointmentRequestDetailModal";

const RequestsSection = ({ appointments, onUpdateAppointment }) => {
  const { openModal } = useModal();

  const handleViewDetail = (appointment) => {
    openModal(
      <AppointmentRequestDetailModal
        appointment={appointment}
        onUpdateAppointment={onUpdateAppointment}
      />,
      {
        maxWidth: "640px",
      }
    );
  };

  return (
    <section
      className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm"
      aria-label="Appointment requests"
    >
      <div className="px-4 sm:px-5 py-3 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
          Appointment requests
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {appointments.length} waiting for your response
        </p>
      </div>
      {appointments.length === 0 ? (
        <div className="py-6 px-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
          No new appointment requests.
        </div>
      ) : (
        <div className="px-2 sm:px-3 py-3 grid grid-cols-1 gap-3">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/70"
            >
              <SpecialistAppointmentRow
                appointment={apt}
                mode="request"
                onViewDetail={handleViewDetail}
                onUpdateLocal={(updated) =>
                  onUpdateAppointment(apt.id, updated)
                }
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default RequestsSection;



