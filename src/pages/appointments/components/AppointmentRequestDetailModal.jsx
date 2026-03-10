import React, { useState } from "react";
import { useModal } from "../../../context/ModalContext";
import StatusCapsule from "../../../components/common/StatusCapsule";
import { updateAppointment, deleteAppointment } from "../../../services/appointmentsApi";

const AppointmentRequestDetailModal = ({ appointment, onUpdateAppointment }) => {
  const { closeModal } = useModal();

  if (!appointment) return null;

  const member = appointment.member || {};
  const name =
    [member.first_name, member.last_name].filter(Boolean).join(" ") ||
    member.username ||
    "Patient";

  const avatarSrc = member.headshot || null;
  const scheduledAt = appointment.scheduled_at
    ? new Date(appointment.scheduled_at).toLocaleString()
    : "Not scheduled";
  const latestProposedFee = appointment.latest_proposed_fee;
  const memberNote = appointment.member_note;
  const [proposedAmount, setProposedAmount] = useState(
    latestProposedFee != null ? String(latestProposedFee) : ""
  );

  const numericOriginal =
    latestProposedFee != null ? Number(latestProposedFee) : null;
  const numericCurrent = proposedAmount !== "" ? Number(proposedAmount) : null;
  const hasValidCurrent =
    numericCurrent != null && !Number.isNaN(numericCurrent) && numericCurrent >= 0;
  const isEditedAmount =
    hasValidCurrent &&
    numericOriginal != null &&
    numericCurrent !== numericOriginal;

  const handleAcceptWithAmount = async () => {
    try {
      const res = await updateAppointment(appointment.id, { status: "confirmed" });
      const updated = res.data?.data || res.data;
      if (onUpdateAppointment) {
        onUpdateAppointment(appointment.id, updated);
      }
      closeModal();
    } catch (err) {
      console.error("Failed to accept appointment:", err);
      // Fallback basic alert; can be replaced with nicer toast later
      alert(
        err.response?.data?.message ||
          "Failed to accept appointment. Please try again."
      );
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this appointment request?"
      )
    ) {
      return;
    }
    try {
      await deleteAppointment(appointment.id);
      if (onUpdateAppointment) {
        onUpdateAppointment(appointment.id, null);
      }
      closeModal();
    } catch (err) {
      console.error("Failed to delete appointment:", err);
      alert(
        err.response?.data?.message ||
          "Failed to delete appointment. Please try again."
      );
    }
  };

  return (
    <div className="max-w-xl space-y-5">
      {/* Header: patient identity */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={name}
              className="h-12 w-12 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-teal-600/10 text-teal-700 dark:text-teal-300 flex items-center justify-center text-base font-semibold border border-teal-500/30">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
            Appointment request from {name}
          </h3>
          {member.email && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {member.email}
            </p>
          )}
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Review this request and decide whether to accept, negotiate, or decline.
          </p>
        </div>
      </div>

      {/* Summary row */}
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50/70 dark:bg-neutral-900/60 px-3 py-2.5 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
        <StatusCapsule
          label={appointment.status_display || appointment.status}
          variant="warning"
          size="sm"
        />
        <span className="h-3 w-px bg-neutral-300 dark:bg-neutral-700 hidden sm:inline-block" />
        <span className="text-neutral-700 dark:text-neutral-200">
          {appointment.appointment_type_display ||
            appointment.appointment_type ||
            "—"}
        </span>
        <span className="text-neutral-400 dark:text-neutral-500">•</span>
        <span className="text-neutral-700 dark:text-neutral-200">
          {appointment.duration_minutes ?? 60} min
        </span>
        <span className="text-neutral-400 dark:text-neutral-500">•</span>
        <span className="text-neutral-700 dark:text-neutral-200">
          {scheduledAt}
        </span>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
            Session type
          </p>
          <p className="text-neutral-900 dark:text-neutral-100">
            {appointment.appointment_type_display ||
              appointment.appointment_type ||
              "—"}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
            Preferred date &amp; time
          </p>
          <p className="text-neutral-900 dark:text-neutral-100">{scheduledAt}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
            Duration
          </p>
          <p className="text-neutral-900 dark:text-neutral-100">
            {appointment.duration_minutes ?? 60} minutes
          </p>
        </div>
        {latestProposedFee && (
          <div>
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
              Latest proposed fee
            </p>
            <p className="text-emerald-700 dark:text-emerald-300 font-semibold">
              ${latestProposedFee}
            </p>
          </div>
        )}
      </div>

      {/* Notes + offer strip */}
      {(memberNote || latestProposedFee) && (
        <div className="mt-1 space-y-4">
          {/* Notes full width */}
          <div>
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
              Notes from patient
            </p>
            <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-100 min-h-[80px] whitespace-pre-wrap">
              {memberNote || (
                <span className="text-neutral-400">
                  No additional notes provided.
                </span>
              )}
            </div>
          </div>

          {/* Propose your amount */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Propose your amount
            </p>
            <div className="flex flex-col items-stretch gap-3">
              <div className="flex-1">
                <label
                  htmlFor="proposed_amount_input"
                  className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1"
                >
                  Amount (you can adjust the patient&apos;s offer)
                </label>
                <div className="rounded-xl border border-emerald-200 dark:border-emerald-700 bg-emerald-50/80 dark:bg-emerald-900/30 px-4 py-3 flex items-center gap-2">
                  <span className="text-sm text-emerald-800 dark:text-emerald-100">
                    $
                  </span>
                  <input
                    id="proposed_amount_input"
                    type="number"
                    min={0}
                    step="0.01"
                    inputMode="decimal"
                    value={proposedAmount}
                    onChange={(e) => setProposedAmount(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-base sm:text-lg text-emerald-900 dark:text-emerald-50 placeholder:text-emerald-300"
                    placeholder={
                      latestProposedFee != null
                        ? String(latestProposedFee)
                        : "Enter amount"
                    }
                  />
                </div>
                <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                  This amount will be used when you accept the request. You can still negotiate
                  further later if needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer actions */}
      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          onClick={handleDelete}
          className="px-4 py-2.5 rounded-lg text-sm font-medium border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
        >
          Delete request
        </button>
        <button
          type="button"
          onClick={handleAcceptWithAmount}
          className="px-4 py-2.5 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
        >
          {isEditedAmount ? "Send negotiation request" : "Accept with this amount"}
        </button>
        <button
          type="button"
          onClick={closeModal}
          className="px-4 py-2.5 rounded-lg text-sm font-medium border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AppointmentRequestDetailModal;

